import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Play } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { VIDEOS, CATEGORIES } from '../data/education';
import GlassCard from '../components/ui/GlassCard';

const Education = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filteredVideos = activeCategory === "All" 
    ? VIDEOS 
    : VIDEOS.filter(v => v.category === activeCategory);

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-4xl font-display font-bold text-white mb-2">Education Hub</h1>
                <p className="text-textMuted">Master new technologies with curated content.</p>
            </div>
            
            <div className="relative group w-full md:w-96">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/50 group-focus-within:text-blue-400 transition-colors">
                    <Search size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search tutorials, courses..." 
                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
                />
            </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
                        activeCategory === category 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'}
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
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Wrapping existing functionality in a cleaner container code if possible, 
                            but for now we just use the VideoCard. 
                            Ideally VideoCard should be updated to be 'glassy' too. */}
                        <VideoCard 
                            video={video} 
                            onClick={setSelectedVideo}
                        />
                    </motion.div>
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
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-[#121212] border border-white/10 rounded-3xl overflow-hidden w-full max-w-5xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative aspect-video bg-black">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`} 
                                title="Video Player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                             <button 
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                                    <p className="text-white/60 text-sm">1.2M views • 2 years ago</p>
                                </div>
                                <div className="flex gap-2">
                                     <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-colors">
                                        Save
                                     </button>
                                     <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors shadow-lg shadow-blue-600/20">
                                        Start Practice
                                     </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                <img src={selectedVideo.channelAvatar} className="w-12 h-12 rounded-full ring-2 ring-white/10" alt="" />
                                <div>
                                    <p className="font-bold text-white">{selectedVideo.channel}</p>
                                    <p className="text-xs text-blue-400">Verified Educator</p>
                                </div>
                                <button className="ml-auto px-4 py-1.5 bg-white text-black font-bold text-sm rounded-full hover:bg-gray-200 transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default Education;
