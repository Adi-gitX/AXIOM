import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS, VIDEOS_BY_TOPIC } from '../data/education';

const Education = () => {
    const [topic, setTopic] = useState(null);
    const [video, setVideo] = useState(null);

    const getTopic = (id) => TOPICS.find(t => t.id === id);
    const videos = topic ? (VIDEOS_BY_TOPIC[topic] || []) : [];

    return (
        <div className="min-h-screen bg-white p-8 lg:p-12">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
                    {topic ? (
                        <div className="flex items-center gap-4">
                            <button onClick={() => setTopic(null)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900">{getTopic(topic)?.name}</h1>
                                <p className="text-gray-400 mt-1">{videos.length} videos</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-4xl font-light text-gray-900">Education</h1>
                            <p className="text-gray-400 mt-2">Choose what to learn</p>
                        </>
                    )}
                </motion.header>

                {/* Topics */}
                {!topic && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {TOPICS.map((t, i) => (
                            <motion.button
                                key={t.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => setTopic(t.id)}
                                className="p-5 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors group"
                            >
                                <span className="text-xs text-gray-400 font-mono">{String(i + 1).padStart(2, '0')}</span>
                                <h3 className="font-medium text-gray-900 mt-2 group-hover:text-gray-600 transition-colors">{t.name}</h3>
                                <p className="text-xs text-gray-400 mt-1">{VIDEOS_BY_TOPIC[t.id]?.length || 0} videos</p>
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
                                className="flex gap-5 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                            >
                                <div className="w-48 aspect-video bg-gray-200 rounded-lg overflow-hidden shrink-0 relative">
                                    <img src={v.thumbnail} alt="" className="w-full h-full object-cover" onError={(e) => e.target.src = `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`} />
                                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">{v.duration}</span>
                                </div>
                                <div className="flex-1 py-1">
                                    <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{v.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2">{v.channel}</p>
                                    <p className="text-xs text-gray-400 mt-1">{v.views}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {video && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-gray-900/95 flex items-center justify-center p-6" onClick={() => setVideo(null)}>
                        <button onClick={() => setVideo(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                            <div className="mt-5">
                                <h2 className="text-white text-xl font-light">{video.title}</h2>
                                <p className="text-white/50 mt-2">{video.channel} · {video.views}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Education;
