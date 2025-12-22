import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { VIDEOS, CATEGORIES } from '../data/education';

const Education = () => {
    const [activeCategory, setActiveCategory] = useState("All");

    return (
        <div className="space-y-8 animate-fade-in">
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
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${activeCategory === category
                                ? 'bg-primary text-white border-primary'
                                : 'bg-surface border-border text-textMuted hover:border-textMuted hover:text-text'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {VIDEOS.map((video) => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
};

export default Education;
