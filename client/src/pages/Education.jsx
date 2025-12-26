import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS, VIDEOS_BY_TOPIC } from '../data/education';

const Education = () => {
    const [topic, setTopic] = useState(null);
    const [video, setVideo] = useState(null);

    const getTopic = (id) => TOPICS.find(t => t.id === id);
    const videos = topic ? (VIDEOS_BY_TOPIC[topic] || []) : [];

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
                                <h1 className="text-3xl font-light text-foreground text-glow font-display">{getTopic(topic)?.name}</h1>
                                <p className="text-muted-foreground mt-1">{videos.length} videos</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-5xl font-light text-foreground text-glow font-display">Education</h1>
                            <p className="text-muted-foreground mt-2">Choose what to learn</p>
                        </>
                    )}
                </motion.header>

                {/* Topics */}
                {!topic && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {TOPICS.map((t, i) => (
                            <motion.button
                                key={t.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => setTopic(t.id)}
                                className="glass-card p-5 rounded-3xl text-left hover:bg-accent/50 transition-all group border border-border hover:border-border/80"
                            >
                                <span className="text-xs text-muted-foreground font-mono group-hover:text-foreground transition-colors">{String(i + 1).padStart(2, '0')}</span>
                                <h3 className="font-medium text-foreground mt-2 group-hover:text-glow transition-all">{t.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{VIDEOS_BY_TOPIC[t.id]?.length || 0} videos</p>
                            </motion.button>
                        ))}
                    </div>
                )}

                {/* Videos */}
                {topic && (
                    <div className="space-y-3">
                        {videos.map((v, i) => (
                            <motion.div
                                key={v.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => setVideo(v)}
                                className="glass-card flex gap-5 p-4 rounded-3xl hover:bg-accent/50 transition-all cursor-pointer group border border-border hover:border-border/80"
                            >
                                <div className="w-48 aspect-video bg-muted rounded-xl overflow-hidden shrink-0 relative border border-border group-hover:border-border/80 transition-all">
                                    <img src={v.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => e.target.src = `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`} />
                                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 backdrop-blur-md text-white text-xs rounded border border-white/10">{v.duration}</span>
                                </div>
                                <div className="flex-1 py-1">
                                    <h3 className="font-medium text-foreground group-hover:text-glow transition-all">{v.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-2">{v.channel}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{v.views}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {video && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setVideo(null)}>
                        <button onClick={() => setVideo(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-accent transition-colors border border-border">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl glass-panel p-1 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="aspect-video bg-black rounded-xl overflow-hidden">
                                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                            <div className="p-6">
                                <h2 className="text-foreground text-xl font-light text-glow">{video.title}</h2>
                                <p className="text-muted-foreground mt-2">{video.channel} · {video.views}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Education;
