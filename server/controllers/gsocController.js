import { query } from '../config/db.js';
import { DSA_TOTAL_PROBLEMS, canonicalizeProblemId } from '../data/dsaCatalog.js';
import { GSOC_TIMELINE_2026 } from '../data/gsocTimeline2026.js';
import { GSOC_ORGS_2026 } from '../data/gsocOrgs2026.js';
import { getOssSummaryForUser } from '../services/ossService.js';

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

const toDateKey = (value = new Date()) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
};

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeDifficultyRank = (difficulty) => {
    const lower = String(difficulty || '').toLowerCase();
    if (lower === 'beginner') return 0;
    if (lower === 'intermediate') return 1;
    if (lower === 'advanced') return 2;
    return 3;
};

const getTimelineWithStatus = (milestones = []) => {
    const today = toDateKey(new Date()) || '';
    return milestones.map((item) => {
        const dateKey = DATE_KEY_RE.test(String(item.date || '')) ? item.date : '';
        let status = 'upcoming';
        if (dateKey && dateKey < today) status = 'completed';
        if (dateKey === today) status = 'today';

        return {
            ...item,
            status,
            daysLeft: dateKey
                ? Math.ceil((new Date(`${dateKey}T00:00:00.000Z`) - new Date(`${today}T00:00:00.000Z`)) / (1000 * 60 * 60 * 24))
                : null,
        };
    });
};

const getReadinessBand = (score) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'On Track';
    if (score >= 40) return 'Needs Work';
    return 'Early Stage';
};

const parseSkills = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string' || !value.trim()) return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const getDsaProgressForUser = async (email) => {
    const solvedResult = await query(`
        SELECT problem_id
        FROM solved_problems
        WHERE user_email = $1
        ORDER BY solved_at DESC
    `, [email]);

    const solvedSet = new Set();
    for (const row of solvedResult.rows) {
        const canonicalId = canonicalizeProblemId(row.problem_id);
        if (canonicalId) solvedSet.add(canonicalId);
    }

    const solvedCount = solvedSet.size;
    const completion = DSA_TOTAL_PROBLEMS > 0
        ? Math.round((solvedCount / DSA_TOTAL_PROBLEMS) * 100)
        : 0;

    return {
        solvedCount,
        totalProblems: DSA_TOTAL_PROBLEMS,
        completion,
    };
};

const getContributionReadiness = (summary) => {
    const prsMerged = toInt(summary?.prsMerged, 0);
    const prsOpened = toInt(summary?.prsOpened, 0);
    const stars = toInt(summary?.stars, 0);

    const raw = (prsMerged * 8) + (prsOpened * 2) + Math.floor(stars / 25);
    const score = Math.min(100, raw);

    return {
        score,
        prsMerged,
        prsOpened,
        stars,
    };
};

export const getGsocTimeline = async (_req, res) => {
    const timeline = getTimelineWithStatus(GSOC_TIMELINE_2026);
    res.json({
        year: 2026,
        timeline,
    });
};

export const getGsocOrgs = async (req, res) => {
    const q = String(req.query.q || '').trim().toLowerCase();
    const difficulty = String(req.query.difficulty || '').trim().toLowerCase();
    const language = String(req.query.language || '').trim().toLowerCase();
    const domain = String(req.query.domain || '').trim().toLowerCase();

    let organizations = [...GSOC_ORGS_2026];

    if (difficulty) {
        organizations = organizations.filter((org) => (
            String(org.difficulty || '').toLowerCase() === difficulty
        ));
    }

    if (language) {
        organizations = organizations.filter((org) => (
            (org.languages || []).some((lang) => String(lang).toLowerCase() === language)
        ));
    }

    if (domain) {
        organizations = organizations.filter((org) => (
            String(org.domain || '').toLowerCase().includes(domain)
        ));
    }

    if (q) {
        organizations = organizations.filter((org) => {
            const haystack = [
                org.name,
                org.domain,
                ...(org.tags || []),
                ...(org.languages || []),
            ].join(' ').toLowerCase();
            return haystack.includes(q);
        });
    }

    organizations.sort((a, b) => {
        const rankDiff = normalizeDifficultyRank(a.difficulty) - normalizeDifficultyRank(b.difficulty);
        if (rankDiff !== 0) return rankDiff;
        return String(a.name || '').localeCompare(String(b.name || ''));
    });

    res.json({
        organizations,
        total: organizations.length,
    });
};

export const getGsocReadiness = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ error: 'email is required' });
        }

        const [dsaProgress, ossSummaryResult, userResult] = await Promise.all([
            getDsaProgressForUser(email),
            getOssSummaryForUser(email).catch(() => ({ connected: false, prsMerged: 0, prsOpened: 0, stars: 0 })),
            query('SELECT skills FROM users WHERE email = $1 LIMIT 1', [email]),
        ]);

        const contribution = getContributionReadiness(ossSummaryResult);
        const readinessScore = Math.round((dsaProgress.completion * 0.65) + (contribution.score * 0.35));

        const skills = parseSkills(userResult.rows[0]?.skills);

        res.json({
            readinessScore,
            readinessBand: getReadinessBand(readinessScore),
            metrics: {
                dsaCompletion: dsaProgress.completion,
                dsaSolved: dsaProgress.solvedCount,
                dsaTotal: dsaProgress.totalProblems,
                contributionScore: contribution.score,
                prsMerged: contribution.prsMerged,
                prsOpened: contribution.prsOpened,
                stars: contribution.stars,
                githubConnected: Boolean(ossSummaryResult?.connected),
            },
            profile: {
                skills,
            },
        });
    } catch (err) {
        console.error('getGsocReadiness error:', err.message);
        res.status(500).json({ error: 'Failed to calculate GSOC readiness' });
    }
};

export const getReminderState = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ error: 'email is required' });
        }

        const includeDismissed = String(req.query.includeDismissed || 'false') === 'true';

        const dismissedResult = await query(`
            SELECT milestone_id
            FROM gsoc_reminder_state
            WHERE user_email = $1
        `, [email]);

        const dismissedSet = new Set(
            dismissedResult.rows
                .map((row) => String(row.milestone_id || '').trim())
                .filter(Boolean)
        );

        const getUrgency = (daysLeft) => {
            const numeric = toInt(daysLeft, Number.MAX_SAFE_INTEGER);
            if (numeric <= 0) return 'today';
            if (numeric <= 3) return 'three_day';
            if (numeric <= 7) return 'seven_day';
            return 'later';
        };

        const allReminders = getTimelineWithStatus(GSOC_TIMELINE_2026).map((item) => ({
            ...item,
            dismissed: dismissedSet.has(item.id),
            urgency: getUrgency(item.daysLeft),
        }));

        const active = allReminders.filter((item) => !item.dismissed);
        const dismissed = allReminders.filter((item) => item.dismissed);
        const reminders = includeDismissed ? allReminders : active;

        res.json({
            reminders,
            active,
            dismissed,
            dismissedMilestones: Array.from(dismissedSet),
            urgency: {
                today: active.filter((item) => item.urgency === 'today').length,
                threeDay: active.filter((item) => item.urgency === 'three_day').length,
                sevenDay: active.filter((item) => item.urgency === 'seven_day').length,
            },
        });
    } catch (err) {
        console.error('getReminderState error:', err.message);
        res.status(500).json({ error: 'Failed to load reminder state' });
    }
};

export const dismissReminder = async (req, res) => {
    try {
        const { email, milestoneId } = req.body;
        if (!email || !milestoneId) {
            return res.status(400).json({ error: 'email and milestoneId are required' });
        }

        await query(`
            INSERT INTO gsoc_reminder_state (user_email, milestone_id, dismissed_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (user_email, milestone_id) DO UPDATE SET
                dismissed_at = CURRENT_TIMESTAMP
        `, [email, milestoneId]);

        res.json({ dismissed: true, milestoneId });
    } catch (err) {
        console.error('dismissReminder error:', err.message);
        res.status(500).json({ error: 'Failed to dismiss reminder' });
    }
};

export const restoreReminder = async (req, res) => {
    try {
        const { email, milestoneId } = req.body;
        if (!email || !milestoneId) {
            return res.status(400).json({ error: 'email and milestoneId are required' });
        }

        await query(
            'DELETE FROM gsoc_reminder_state WHERE user_email = $1 AND milestone_id = $2',
            [email, milestoneId]
        );

        res.json({ dismissed: false, milestoneId });
    } catch (err) {
        console.error('restoreReminder error:', err.message);
        res.status(500).json({ error: 'Failed to restore reminder' });
    }
};

export default {
    getGsocTimeline,
    getGsocOrgs,
    getGsocReadiness,
    getReminderState,
    dismissReminder,
    restoreReminder,
};
