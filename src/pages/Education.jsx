import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Play } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { VIDEOS, CATEGORIES } from '../data/education';

const Education = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filteredVideos = activeCategory === "All" 
    ? VIDEOS 
    : VIDEOS.filter(v => v.category === activeCategory);

  return (
    <div className="space-y-8 animate-fade-in relative min-h-screen pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-display font-bold text-text">Education Hub</h1>
                <p className="text-textMuted mt-1">Master new technologies with curated content.</p>
            </div>
            
            <div className="relative group w-full md:w-96">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-textMuted group-focus-within:text-primary transition-colors">
                    <Search size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search tutorials, courses..." 
                    className="w-full bg-surface border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-textMuted/50"
                />
            </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                        activeCategory === category 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-surface border-border text-textMuted hover:border-textMuted hover:text-text'}
                    `}
                >
                    {category}
                </button>
            ))}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
                {filteredVideos.map((video) => (
                    <VideoCard 
                        key={video.id} 
                        video={video} 
                        onClick={setSelectedVideo}
                    />
                ))}
            </AnimatePresence>
        </div>

        {/* Video Modal */}
        <AnimatePresence>
            {selectedVideo && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-surface border border-border rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative aspect-video bg-black">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                                title="Video Player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                             <button 
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-text mb-2">{selectedVideo.title}</h2>
                            <div className="flex items-center gap-4 mb-4">
                                <img src={selectedVideo.channelAvatar} className="w-10 h-10 rounded-full" alt="" />
                                <div>
                                    <p className="font-medium text-text">{selectedVideo.channel}</p>
                                    <p className="text-xs text-textMuted">Subscribed</p>
                                </div>
                            </div>
                            <p className="text-textMuted text-sm">
                                Full interactive transcript and coding exercises are loading...
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default Education;
