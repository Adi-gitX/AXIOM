import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { educationApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/ui/GlassCard';

const Education = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [topic, setTopic] = useState(null);
    const [video, setVideo] = useState(null);
    const [topics, setTopics] = useState([]);
    const [videosByTopic, setVideosByTopic] = useState({});
    const [watchedVideos, setWatchedVideos] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryNonce, setRetryNonce] = useState(0);
    const hasSnapshotRef = useRef(false);
    const isTransientApiError = (err) => (
        err?.status === 401
        || err?.status === 429
        || err?.status === 503
        || err?.code === 'BACKEND_UNAVAILABLE'
    );

    useEffect(() => {
        hasSnapshotRef.current = topics.length > 0 || Object.keys(videosByTopic).length > 0;
    }, [topics, videosByTopic]);

    const getTopic = (id) => topics.find((t) => t.id === id);
    const videos = topic ? (videosByTopic[topic] || []) : [];

    // Load catalog and user progress from API
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError('');

            try {
                const catalog = await educationApi.getCatalog();

                const catalogTopics = Array.isArray(catalog?.topics) ? catalog.topics : [];
                const catalogVideos = (catalog?.videosByTopic && typeof catalog.videosByTopic === 'object')
                    ? catalog.videosByTopic
                    : {};
                setTopics(catalogTopics);
                setVideosByTopic(catalogVideos);

                let progress = [];
                if (currentUser?.email) {
                    try {
                        progress = await educationApi.getProgress(currentUser.email);
                    } catch (progressErr) {
                        if (!isTransientApiError(progressErr)) {
                            console.error('Failed to load education progress:', progressErr);
                        }
                        setError('Failed to load watch progress');
                    }
                }

                // Convert array to lookup object
                const progressMap = {};
                (progress || []).forEach(p => {
                    const progressValue = Number(
                        p.watch_percentage ?? p.progress ?? 0
                    ) || 0;
                    const completedValue = p.is_completed ?? p.completed ?? false;
                    progressMap[p.video_id] = {
                        progress: progressValue,
                        completed: completedValue === true || completedValue === 1 || completedValue === '1'
                    };
                });
                setWatchedVideos(progressMap);
            } catch (err) {
                if (!isTransientApiError(err)) {
                    console.error('Failed to load education data:', err);
                }
                setError(
                    hasSnapshotRef.current
                        ? 'Education refresh is limited right now. Showing last synced catalog.'
                        : 'Failed to load education content'
                );
                if (!hasSnapshotRef.current) {
                    setTopics([]);
                    setVideosByTopic({});
                }
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentUser?.email, retryNonce]);

    // Track video progress when video is opened
    const handleVideoOpen = async (v) => {
        setVideo(v);

        if (!currentUser?.email) return;

        // Mark as started if not already
        if (!watchedVideos[v.id]) {
            try {
                await educationApi.updateProgress(currentUser.email, v.id, topic, 0);
                setWatchedVideos(prev => ({
                    ...prev,
                    [v.id]: { progress: 0, completed: false }
                }));
            } catch (err) {
                console.error('Failed to track video start:', err);
            }
        }
    };

    // Mark video as complete
    const markComplete = async () => {
        if (!video || !currentUser?.email) return;

        try {
            await educationApi.markWatched(currentUser.email, video.id, topic);
            setWatchedVideos(prev => ({
                ...prev,
                [video.id]: { progress: 100, completed: true }
            }));
        } catch (err) {
            console.error('Failed to mark complete:', err);
        }
    };

    // Calculate topic progress
    const getTopicProgress = (topicId) => {
        const topicVideos = videosByTopic[topicId] || [];
        if (topicVideos.length === 0) return 0;
        const completed = topicVideos.filter(v => watchedVideos[v.id]?.completed).length;
        return Math.round((completed / topicVideos.length) * 100);
    };

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
                    {topic ? (
                        <div className="flex items-center gap-4">
                            <button onClick={() => setTopic(null)} className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <div>
                                <h1 className="text-3xl font-light text-foreground font-display tracking-tight">{getTopic(topic)?.name}</h1>
                                <p className="text-muted-foreground mt-1">{videos.length} videos • {getTopicProgress(topic)}% complete</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-5xl font-light text-foreground font-display tracking-tight">Education</h1>
                            <p className="text-muted-foreground text-lg font-light mt-2">Choose what to learn</p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/app/dsa')}
                                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-foreground/40"
                                >
                                    Go to DSA Tracker
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/app/interview')}
                                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-foreground/40"
                                >
                                    Go to Interview Prep
                                </button>
                            </div>
                            {error && <p className="text-sm text-rose-400 mt-3">{error}</p>}
                            {error && (
                                <button
                                    type="button"
                                    onClick={() => setRetryNonce((value) => value + 1)}
                                    className="mt-3 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-foreground/40"
                                >
                                    Retry
                                </button>
                            )}
                        </>
                    )}
                </motion.header>

                {/* Topics Grid */}
                {!topic && (
                    loading ? (
                        <div className="text-muted-foreground py-8">Loading topics...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {topics.map((t, i) => {
                                const progress = getTopicProgress(t.id);
                                const videoCount = videosByTopic[t.id]?.length || 0;

                                return (
                                    <GlassCard
                                        key={t.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.02 }}
                                        onClick={() => setTopic(t.id)}
                                        hoverEffect={true}
                                        className="p-5 text-left"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-muted-foreground font-mono">{String(i + 1).padStart(2, '0')}</span>
                                            {progress > 0 && (
                                                <span className={`text-xs font-bold ${progress === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    {progress}%
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-foreground">{t.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{videoCount} {videoCount === 1 ? 'video' : 'videos'}</p>
                                        <p className="text-[11px] text-muted-foreground mt-1">
                                            {progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                                        </p>

                                        {/* Progress bar */}
                                        {progress > 0 && (
                                            <div className="mt-3 h-1 w-full rounded-full bg-foreground/10 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${progress === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </GlassCard>
                                );
                            })}
                        </div>
                    )
                )}

                {!loading && !topic && topics.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        {error || 'No education topics available'}
                    </div>
                )}

                {/* Videos List */}
                {topic && (
                    <div className="space-y-3">
                        {videos.map((v, i) => {
                            const isWatched = watchedVideos[v.id]?.completed;
                            const isStarted = watchedVideos[v.id] && !isWatched;

                            return (
                                <GlassCard
                                    key={v.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    onClick={() => handleVideoOpen(v)}
                                    hoverEffect={true}
                                    className="flex gap-5 p-4"
                                >
                                    <div className="w-48 aspect-video bg-muted rounded-xl overflow-hidden shrink-0 relative border border-border">
                                        <img
                                            src={v.thumbnail}
                                            alt=""
                                            className={`w-full h-full object-cover ${isWatched ? 'opacity-50' : 'opacity-80 group-hover:opacity-100'} transition-opacity`}
                                            onError={(e) => e.target.src = `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`}
                                        />
                                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-md text-white text-xs rounded border border-white/10">
                                            {v.duration}
                                        </span>
                                        {isWatched && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 py-1">
                                        <div className="flex items-start justify-between">
                                            <h3 className={`font-medium ${isWatched ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                {v.title}
                                            </h3>
                                            {isStarted && (
                                                <span className="text-xs text-amber-400 font-medium">In Progress</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">{v.channel}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{v.views}</p>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>
                )}

            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {video && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-6"
                        onClick={() => setVideo(null)}
                    >
                        <button
                            onClick={() => setVideo(null)}
                            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-accent transition-colors border border-border"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-5xl glass-panel p-1 rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="aspect-video bg-black rounded-xl overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-foreground text-xl font-light">{video.title}</h2>
                                    <p className="text-muted-foreground mt-2">{video.channel} · {video.views}</p>
                                </div>
                                <button
                                    onClick={markComplete}
                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${watchedVideos[video.id]?.completed
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-foreground text-background'
                                        }`}
                                >
                                    {watchedVideos[video.id]?.completed ? '✓ Completed' : 'Mark Complete'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Education;
