import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoCard = ({ video }) => {
    return (
        <motion.div
            className="group relative bg-surfaceHighlight/30 border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 cursor-pointer"
            whileHover={{ y: -5 }}
        >
            {/* Thumbnail */}
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <Play size={20} fill="currentColor" />
                    </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-xs px-1.5 py-0.5 rounded text-white font-medium">
                    {video.duration}
                </span>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex gap-3">
                    <img
                        src={video.channelAvatar}
                        alt={video.channel}
                        className="w-9 h-9 rounded-full border border-border object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-text text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {video.title}
                        </h3>
                        <p className="text-textMuted text-xs mt-1">{video.channel}</p>
                        <div className="flex items-center gap-2 text-textMuted text-xs mt-1">
                            <span>{video.views}</span>
                            <span>•</span>
                            <span>{video.uploaded}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoCard;
