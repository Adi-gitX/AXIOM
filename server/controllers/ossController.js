import crypto from 'crypto';
import { query } from '../config/db.js';
import { decryptText, encryptText } from '../utils/crypto.js';
import { getIssueRecommendationForUser, getOssSummaryForUser } from '../services/ossService.js';

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_AUTH_BASE = 'https://github.com/login/oauth';
const DEFAULT_FRONTEND = 'http://localhost:5173';
const DEFAULT_BACKEND = 'http://localhost:3000';
const DEFAULT_SCOPES = ['read:user', 'repo', 'read:org'];

const parseJsonArray = (value, fallback = []) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string' || !value.trim()) return fallback;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
};

const getFrontEndUrl = () => (
    process.env.FRONTEND_URL
    || process.env.CLIENT_URL
    || DEFAULT_FRONTEND
);

const getBackEndUrl = () => (
    process.env.BACKEND_URL
    || process.env.API_BASE_URL
    || process.env.VITE_API_URL
    || DEFAULT_BACKEND
);

const getOAuthConfig = () => ({
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    redirectUri: process.env.GITHUB_REDIRECT_URI || `${getBackEndUrl()}/api/oss/github/callback`,
});

const getStateSecret = () => (
    process.env.GITHUB_STATE_SECRET
    || process.env.GITHUB_TOKEN_SECRET
    || process.env.JWT_SECRET
    || 'axiom-oss-state-secret'
);

const buildSignedState = (email) => {
    const payload = {
        email,
        ts: Date.now(),
        nonce: crypto.randomBytes(8).toString('hex'),
    };
    const body = JSON.stringify(payload);
    const sig = crypto.createHmac('sha256', getStateSecret()).update(body).digest('hex');
    return Buffer.from(JSON.stringify({ body, sig })).toString('base64url');
};

const parseSignedState = (state) => {
    try {
        const decoded = Buffer.from(String(state || ''), 'base64url').toString('utf8');
        const outer = JSON.parse(decoded);
        if (!outer?.body || !outer?.sig) return null;
        const expected = crypto.createHmac('sha256', getStateSecret()).update(outer.body).digest('hex');
        if (expected !== outer.sig) return null;
        const payload = JSON.parse(outer.body);
        if (!payload?.email || !payload?.ts) return null;
        if (Date.now() - Number(payload.ts) > 15 * 60 * 1000) return null;
        return payload;
    } catch {
        return null;
    }
};

const githubFetch = async (path, token) => {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
            'User-Agent': 'axiom-oss-engine',
        },
    });
    if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`GitHub API ${response.status}: ${text.slice(0, 160)}`);
    }
    return response.json();
};

const getRepoFullNameFromUrl = (repositoryUrl = '') => {
    const parts = String(repositoryUrl).split('/').filter(Boolean);
    if (parts.length < 2) return '';
    return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
};

const refreshContributionDaily = async (email) => {
    await query('DELETE FROM github_contribution_daily WHERE user_email = $1', [email]);
    const allResult = await query(`
        SELECT created_at, merged_at
        FROM github_pull_requests
        WHERE user_email = $1
    `, [email]);

    const byDate = new Map();
    const ensureDate = (dateKey) => {
        if (!byDate.has(dateKey)) {
            byDate.set(dateKey, {
                prs_opened: 0,
                prs_merged: 0,
            });
        }
        return byDate.get(dateKey);
    };

    for (const row of allResult.rows) {
        const opened = String(row.created_at || '').slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(opened)) {
            ensureDate(opened).prs_opened += 1;
        }
        const merged = String(row.merged_at || '').slice(0, 10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(merged)) {
            ensureDate(merged).prs_merged += 1;
        }
    }

    for (const [activityDate, data] of byDate.entries()) {
        await query(`
            INSERT INTO github_contribution_daily (
                user_email, activity_date, prs_opened, prs_merged, stars_gained
            )
            VALUES ($1, $2, $3, $4, 0)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                prs_opened = $3,
                prs_merged = $4
        `, [email, activityDate, data.prs_opened, data.prs_merged]);
    }
};

const refreshIssueCache = async (token) => {
    const candidateRepos = [
        'facebook/react',
        'vercel/next.js',
        'microsoft/vscode',
        'nodejs/node',
        'freeCodeCamp/freeCodeCamp',
    ];

    for (const repo of candidateRepos) {
        const issues = await githubFetch(
            `/repos/${repo}/issues?state=open&labels=good%20first%20issue&per_page=10`,
            token
        ).catch(() => []);

        for (const issue of issues) {
            if (issue?.pull_request) continue;
            const labels = Array.isArray(issue.labels)
                ? issue.labels.map((label) => (typeof label === 'string' ? label : label?.name)).filter(Boolean)
                : [];

            await query(`
                INSERT INTO good_first_issue_cache (
                    repo_full_name, issue_number, title, html_url, labels_json, language, is_open, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, 1, CURRENT_TIMESTAMP)
                ON CONFLICT (repo_full_name, issue_number) DO UPDATE SET
                    title = EXCLUDED.title,
                    html_url = EXCLUDED.html_url,
                    labels_json = EXCLUDED.labels_json,
                    language = EXCLUDED.language,
                    is_open = 1,
                    updated_at = CURRENT_TIMESTAMP
            `, [
                repo,
                issue.number,
                issue.title || '',
                issue.html_url || '',
                JSON.stringify(labels),
                issue?.repository?.language || issue?.language || '',
            ]);
        }
    }
};

const performGithubSync = async ({ email, token, username }) => {
    const search = await githubFetch(
        `/search/issues?q=author:${encodeURIComponent(username)}+is:pr&sort=updated&order=desc&per_page=50`,
        token
    );
    const items = Array.isArray(search.items) ? search.items : [];

    for (const item of items) {
        const repoFullName = getRepoFullNameFromUrl(item.repository_url);
        const prId = Number.parseInt(item.id, 10);
        const prNumber = Number.parseInt(item.number, 10);

        let mergedAt = null;
        if (item.pull_request?.url) {
            const prDetails = await fetch(item.pull_request.url, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${token}`,
                    'User-Agent': 'axiom-oss-engine',
                },
            }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
            mergedAt = prDetails?.merged_at || null;
        }

        await query(`
            INSERT INTO github_pull_requests (
                user_email, pr_id, repo_full_name, title, state, merged_at, created_at, html_url
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (user_email, pr_id) DO UPDATE SET
                repo_full_name = EXCLUDED.repo_full_name,
                title = EXCLUDED.title,
                state = EXCLUDED.state,
                merged_at = EXCLUDED.merged_at,
                created_at = EXCLUDED.created_at,
                html_url = EXCLUDED.html_url
        `, [
            email,
            prId || prNumber,
            repoFullName,
            item.title || '',
            item.state || '',
            mergedAt,
            item.created_at || null,
            item.html_url || '',
        ]);
    }

    const repos = await githubFetch(`/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner`, token)
        .catch(() => []);
    const starsTotal = (Array.isArray(repos) ? repos : []).reduce(
        (sum, repo) => sum + (Number.parseInt(repo.stargazers_count, 10) || 0),
        0
    );

    await refreshContributionDaily(email);
    await refreshIssueCache(token);

    await query(`
        UPDATE github_connections
        SET stars_total = $2, last_sync_at = CURRENT_TIMESTAMP, sync_error = NULL
        WHERE user_email = $1
    `, [email, starsTotal]);

    return getOssSummaryForUser(email);
};

export const getGithubConnectUrl = async (req, res) => {
    const { email } = req.query;
    const { clientId, redirectUri } = getOAuthConfig();
    if (!email) {
        return res.status(400).json({ error: 'email query param is required' });
    }
    if (!clientId) {
        return res.status(500).json({ error: 'GitHub OAuth is not configured' });
    }

    const state = buildSignedState(email);
    const url = new URL(`${GITHUB_AUTH_BASE}/authorize`);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('scope', DEFAULT_SCOPES.join(' '));
    url.searchParams.set('state', state);

    res.json({ url: url.toString() });
};

export const githubOAuthCallback = async (req, res) => {
    const { code, state } = req.query;
    const parsedState = parseSignedState(state);
    if (!code || !parsedState?.email) {
        return res.status(400).json({ error: 'Invalid OAuth callback request' });
    }

    const { clientId, clientSecret, redirectUri } = getOAuthConfig();
    if (!clientId || !clientSecret) {
        return res.status(500).json({ error: 'GitHub OAuth is not configured' });
    }

    try {
        const tokenResponse = await fetch(`${GITHUB_AUTH_BASE}/access_token`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
            }),
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        if (!accessToken) {
            throw new Error('GitHub token exchange failed');
        }

        const me = await githubFetch('/user', accessToken);
        const encrypted = encryptText(accessToken);
        await query(`
            INSERT INTO github_connections (
                user_email, github_user_id, username, avatar_url, access_token_enc, scope, connected_at, sync_error
            )
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, NULL)
            ON CONFLICT (user_email) DO UPDATE SET
                github_user_id = EXCLUDED.github_user_id,
                username = EXCLUDED.username,
                avatar_url = EXCLUDED.avatar_url,
                access_token_enc = EXCLUDED.access_token_enc,
                scope = EXCLUDED.scope,
                connected_at = CURRENT_TIMESTAMP,
                sync_error = NULL
        `, [
            parsedState.email,
            String(me.id || ''),
            me.login || '',
            me.avatar_url || '',
            encrypted,
            tokenData.scope || DEFAULT_SCOPES.join(' '),
        ]);

        performGithubSync({
            email: parsedState.email,
            token: accessToken,
            username: me.login || '',
        }).catch(async (syncErr) => {
            console.error('Initial GitHub sync error:', syncErr.message);
            await query(`
                UPDATE github_connections
                SET sync_error = $2, last_sync_at = CURRENT_TIMESTAMP
                WHERE user_email = $1
            `, [parsedState.email, String(syncErr.message || '').slice(0, 500)]);
        });

        const destination = `${getFrontEndUrl()}/app/oss?connected=1&sync=started`;
        return res.redirect(destination);
    } catch (err) {
        console.error('githubOAuthCallback error:', err.message);
        const destination = `${getFrontEndUrl()}/app/oss?connected=0&sync=failed`;
        return res.redirect(destination);
    }
};

export const disconnectGithub = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }

    await query('DELETE FROM github_connections WHERE user_email = $1', [email]);
    await query('DELETE FROM github_pull_requests WHERE user_email = $1', [email]);
    await query('DELETE FROM github_contribution_daily WHERE user_email = $1', [email]);

    return res.json({ disconnected: true });
};

export const syncGithubContributions = async (req, res) => {
    const email = req.params.email || req.body?.email;
    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }

    const connectionResult = await query(`
        SELECT username, access_token_enc
        FROM github_connections
        WHERE user_email = $1
        LIMIT 1
    `, [email]);
    const connection = connectionResult.rows[0];
    if (!connection?.access_token_enc) {
        return res.status(404).json({ error: 'GitHub account is not connected' });
    }

    const token = decryptText(connection.access_token_enc);
    if (!token) {
        return res.status(500).json({ error: 'Failed to decrypt GitHub token' });
    }

    try {
        const summary = await performGithubSync({
            email,
            token,
            username: connection.username,
        });
        return res.json({ synced: true, summary });
    } catch (err) {
        console.error('syncGithubContributions error:', err.message);
        await query(`
            UPDATE github_connections
            SET sync_error = $2, last_sync_at = CURRENT_TIMESTAMP
            WHERE user_email = $1
        `, [email, String(err.message || '').slice(0, 500)]);
        return res.status(500).json({ error: 'Failed to sync GitHub contributions' });
    }
};

export const getSyncStatus = async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }

    const result = await query(`
        SELECT username, connected_at, last_sync_at, sync_error
        FROM github_connections
        WHERE user_email = $1
        LIMIT 1
    `, [email]);

    if (result.rows.length === 0) {
        return res.json({
            connected: false,
            syncing: false,
            lastSyncAt: null,
            syncError: null,
            username: null,
        });
    }

    const row = result.rows[0];
    const hasCompletedSync = Boolean(row.last_sync_at);
    const hasSyncError = Boolean(row.sync_error);

    return res.json({
        connected: true,
        syncing: !hasCompletedSync && !hasSyncError,
        lastSyncAt: row.last_sync_at || null,
        syncError: row.sync_error || null,
        username: row.username || null,
        connectedAt: row.connected_at || null,
    });
};

export const getMyContributions = async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }

    try {
        const summary = await getOssSummaryForUser(email);
        return res.json(summary);
    } catch (err) {
        console.error('getMyContributions error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch contribution summary' });
    }
};

export const getOssActivity = async (req, res) => {
    const { email } = req.params;
    const days = Math.min(365, Math.max(1, Number.parseInt(req.query.days, 10) || 365));
    const today = new Date();
    const from = new Date(today);
    from.setUTCDate(from.getUTCDate() - (days - 1));
    const fromKey = from.toISOString().slice(0, 10);

    const result = await query(`
        SELECT activity_date, prs_opened, prs_merged, stars_gained
        FROM github_contribution_daily
        WHERE user_email = $1 AND activity_date >= $2
        ORDER BY activity_date ASC
    `, [email, fromKey]);

    res.json({
        from: fromKey,
        to: today.toISOString().slice(0, 10),
        rows: result.rows.map((row) => ({
            activity_date: String(row.activity_date || '').slice(0, 10),
            prs_opened: Number.parseInt(row.prs_opened, 10) || 0,
            prs_merged: Number.parseInt(row.prs_merged, 10) || 0,
            stars_gained: Number.parseInt(row.stars_gained, 10) || 0,
        })),
    });
};

export const getIssueRecommendation = async (req, res) => {
    const { email } = req.params;
    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }
    try {
        const recommendation = await getIssueRecommendationForUser(email);
        return res.json({ recommendation });
    } catch (err) {
        console.error('getIssueRecommendation error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch issue recommendation' });
    }
};

export const getConnectedGithubProfile = async (req, res) => {
    const { email } = req.params;
    const result = await query(`
        SELECT username, avatar_url, scope, connected_at, last_sync_at, sync_error
        FROM github_connections
        WHERE user_email = $1
        LIMIT 1
    `, [email]);

    if (result.rows.length === 0) {
        return res.json({ connected: false });
    }

    const row = result.rows[0];
    return res.json({
        connected: true,
        username: row.username || null,
        avatar_url: row.avatar_url || null,
        scope: row.scope || '',
        connected_at: row.connected_at || null,
        last_sync_at: row.last_sync_at || null,
        sync_error: row.sync_error || null,
    });
};

export default {
    getGithubConnectUrl,
    githubOAuthCallback,
    disconnectGithub,
    syncGithubContributions,
    getSyncStatus,
    getMyContributions,
    getOssActivity,
    getIssueRecommendation,
    getConnectedGithubProfile,
};
