import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, RefreshCw, Link2, Flame, Star, GitPullRequest, ArrowUpRight, Unplug } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../contexts/AuthContext';
import { ossApi } from '../lib/api';

const OssContributionEngine = () => {
    const { currentUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const [summary, setSummary] = useState(null);
    const [profile, setProfile] = useState({ connected: false });
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState({
        syncing: false,
        lastSyncAt: null,
        syncError: '',
    });
    const [error, setError] = useState('');
    const [retryNonce, setRetryNonce] = useState(0);
    const syncPollRef = useRef(null);
    const handledQuerySyncRef = useRef(false);
    const hasSnapshotRef = useRef(false);
    const isTransientApiError = (err) => (
        err?.status === 401
        || err?.status === 429
        || err?.status === 503
        || err?.code === 'BACKEND_UNAVAILABLE'
    );

    const email = currentUser?.email || '';

    useEffect(() => {
        hasSnapshotRef.current = Boolean(
            summary
            || (profile && Object.keys(profile).length > 0 && profile.connected !== undefined)
            || syncStatus.lastSyncAt
        );
    }, [summary, profile, syncStatus.lastSyncAt]);

    const stopSyncPolling = useCallback(() => {
        if (syncPollRef.current) {
            clearInterval(syncPollRef.current);
            syncPollRef.current = null;
        }
    }, []);

    const loadData = useCallback(async () => {
        if (!email) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const hasStaleSnapshot = hasSnapshotRef.current;
        setError('');
        try {
            const [summaryData, profileData, syncState] = await Promise.all([
                ossApi.getContributions(email),
                ossApi.getGithubProfile(email),
                ossApi.getSyncStatus(email).catch(() => null),
            ]);
            setSummary(summaryData);
            setProfile(profileData);
            setSyncStatus({
                syncing: Boolean(syncState?.syncing),
                lastSyncAt: syncState?.lastSyncAt || profileData?.last_sync_at || null,
                syncError: syncState?.syncError || profileData?.sync_error || '',
            });
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to load OSS data:', err);
            }
            setError(
                hasStaleSnapshot
                    ? 'Live OSS refresh is limited right now. Showing last synced data.'
                    : 'Failed to load OSS data.'
            );
            if (!hasStaleSnapshot) {
                setSummary(null);
                setProfile({ connected: false });
                setSyncStatus({ syncing: false, lastSyncAt: null, syncError: '' });
            }
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        stopSyncPolling();
        loadData();
        return () => stopSyncPolling();
    }, [loadData, stopSyncPolling, retryNonce]);

    useEffect(() => {
        const connectedFlag = searchParams.get('connected');
        const syncFlag = searchParams.get('sync');
        if (!connectedFlag && !syncFlag) return;
        if (handledQuerySyncRef.current) return;
        handledQuerySyncRef.current = true;

        loadData();

        if (connectedFlag === '1' && syncFlag === 'started' && email) {
            stopSyncPolling();
            setSyncStatus((prev) => ({ ...prev, syncing: true, syncError: '' }));

            const poll = async () => {
                try {
                    const state = await ossApi.getSyncStatus(email);
                    setSyncStatus({
                        syncing: Boolean(state?.syncing),
                        lastSyncAt: state?.lastSyncAt || null,
                        syncError: state?.syncError || '',
                    });

                    if (!state?.syncing) {
                        stopSyncPolling();
                        await loadData();
                    }
                } catch {
                    stopSyncPolling();
                }
            };

            poll();
            syncPollRef.current = setInterval(poll, 2500);
        }

        if (connectedFlag === '0') {
            setError('GitHub connection failed. Please retry.');
        }

        const next = new URLSearchParams(searchParams);
        next.delete('connected');
        next.delete('sync');
        setSearchParams(next, { replace: true });
    }, [searchParams, setSearchParams, email, loadData, stopSyncPolling]);

    useEffect(() => {
        if (!searchParams.get('connected') && !searchParams.get('sync')) {
            handledQuerySyncRef.current = false;
        }
    }, [searchParams]);

    const connectGithub = async () => {
        if (!email) return;
        setError('');
        try {
            const data = await ossApi.getGithubConnectUrl(email);
            if (data?.url) {
                window.location.href = data.url;
                return;
            }
            setError('GitHub OAuth is not configured yet.');
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to get GitHub connect URL:', err);
            }
            setError(err.message || 'Failed to start GitHub connection.');
        }
    };

    const sync = async () => {
        if (!email) return;
        setSyncing(true);
        setError('');
        setSyncStatus((prev) => ({ ...prev, syncing: true, syncError: '' }));
        try {
            const data = await ossApi.syncContributions(email);
            if (data?.summary) {
                setSummary(data.summary);
            } else {
                await loadData();
            }
            const state = await ossApi.getSyncStatus(email).catch(() => null);
            setSyncStatus({
                syncing: false,
                lastSyncAt: state?.lastSyncAt || new Date().toISOString(),
                syncError: state?.syncError || '',
            });
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to sync GitHub contributions:', err);
            }
            setError(err.message || 'Sync failed.');
            setSyncStatus((prev) => ({
                ...prev,
                syncing: false,
                syncError: err.message || 'Sync failed.',
            }));
        } finally {
            setSyncing(false);
        }
    };

    const disconnect = async () => {
        if (!email) return;
        try {
            await ossApi.disconnectGithub(email);
            stopSyncPolling();
            setSyncStatus({ syncing: false, lastSyncAt: null, syncError: '' });
            await loadData();
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to disconnect GitHub:', err);
            }
            setError('Failed to disconnect GitHub.');
        }
    };

    const connected = Boolean(profile?.connected || summary?.connected);
    const syncingNow = syncing || syncStatus.syncing;
    const formatSyncTime = (value) => {
        if (!value) return '';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return '';
        return parsed.toLocaleString();
    };

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-6">
                <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <h1 className="text-3xl lg:text-4xl font-semibold text-foreground font-display tracking-tight">OSS Contribution Engine</h1>
                    <p className="text-muted-foreground text-lg font-light mt-1">
                        Link GitHub, import PR history, and get issue recommendations.
                    </p>
                </motion.header>

                {error && (
                    <GlassCard className="p-4" hoverEffect={false}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-rose-500">{error}</p>
                            <button
                                type="button"
                                onClick={() => setRetryNonce((prev) => prev + 1)}
                                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-foreground/40"
                            >
                                Retry
                            </button>
                        </div>
                    </GlassCard>
                )}

                <GlassCard className="p-5" hoverEffect={false}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-foreground">GitHub Connection</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {connected
                                    ? `Connected as @${profile?.username || summary?.username || 'github-user'}`
                                    : 'Not connected'}
                            </p>
                            {connected && syncStatus.lastSyncAt && (
                                <p className="text-[11px] text-muted-foreground mt-1">
                                    Last sync: {formatSyncTime(syncStatus.lastSyncAt)}
                                </p>
                            )}
                            {connected && syncingNow && (
                                <p className="text-[11px] text-muted-foreground mt-1">
                                    Initial import is running. This view updates automatically.
                                </p>
                            )}
                            {connected && syncStatus.syncError && (
                                <p className="text-[11px] text-rose-500 mt-1">
                                    Sync issue: {syncStatus.syncError}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {!connected ? (
                                <button
                                    type="button"
                                    onClick={connectGithub}
                                    className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
                                >
                                    <Github className="w-4 h-4" /> Connect GitHub
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={sync}
                                        disabled={syncingNow}
                                        className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-foreground/40 inline-flex items-center gap-2"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${syncingNow ? 'animate-spin' : ''}`} />
                                        {syncingNow ? 'Syncing...' : 'Sync Contributions'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={disconnect}
                                        className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
                                    >
                                        <Unplug className="w-4 h-4" /> Disconnect
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </GlassCard>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <GlassCard className="p-5" hoverEffect={false}>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">PRs Opened</p>
                        <p className="text-3xl font-light mt-2">{loading ? '...' : (summary?.prsOpened ?? 0)}</p>
                    </GlassCard>
                    <GlassCard className="p-5" hoverEffect={false}>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Merged PRs</p>
                        <p className="text-3xl font-light mt-2">{loading ? '...' : (summary?.prsMerged ?? 0)}</p>
                    </GlassCard>
                    <GlassCard className="p-5" hoverEffect={false}>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Stars</p>
                        <p className="text-3xl font-light mt-2">{loading ? '...' : (summary?.stars ?? 0)}</p>
                    </GlassCard>
                    <GlassCard className="p-5" hoverEffect={false}>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Merged Streak</p>
                        <p className="text-3xl font-light mt-2 inline-flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" />
                            {loading ? '...' : (summary?.mergedPrStreak ?? 0)}
                        </p>
                    </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <GlassCard className="p-5 lg:col-span-2" hoverEffect={false}>
                        <div className="flex items-center gap-2 mb-4">
                            <GitPullRequest className="w-4 h-4 text-foreground" />
                            <p className="text-sm font-semibold text-foreground">My Contributions</p>
                        </div>

                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading contribution history...</p>
                        ) : (summary?.recentPrs || []).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No PRs imported yet. Run a sync after connecting GitHub.</p>
                        ) : (
                            <div className="divide-y divide-border/50">
                                {(summary?.recentPrs || []).map((pr) => (
                                    <a
                                        key={`${pr.pr_id}-${pr.repo_full_name}`}
                                        href={pr.html_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block py-3 group hover:pl-2 transition-all"
                                    >
                                        <div className="flex items-center justify-between gap-2 min-w-0">
                                            <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-glow transition-all">{pr.title}</p>
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {pr.repo_full_name} • {pr.merged_at ? 'Merged' : 'Open'}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        )}
                    </GlassCard>

                    <GlassCard className="p-5" hoverEffect={false}>
                        <div className="flex items-center gap-2 mb-3">
                            <Star className="w-4 h-4 text-foreground" />
                            <p className="text-sm font-semibold text-foreground">Smart Issue Match</p>
                        </div>

                        {summary?.issueRecommendation ? (
                            <>
                                <p className="text-sm font-medium text-foreground">{summary.issueRecommendation.title}</p>
                                <p className="text-[11px] text-muted-foreground mt-1">{summary.issueRecommendation.repo_full_name}</p>
                                <a
                                    href={summary.issueRecommendation.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline"
                                >
                                    Open issue <ArrowUpRight className="w-3 h-3" />
                                </a>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No recommendation available yet. Connect and sync GitHub to generate matches.
                            </p>
                        )}

                        {!connected && (
                            <button
                                type="button"
                                onClick={connectGithub}
                                className="mt-4 text-xs font-semibold text-foreground inline-flex items-center gap-1 hover:underline"
                            >
                                Connect GitHub <Link2 className="w-3 h-3" />
                            </button>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default OssContributionEngine;
