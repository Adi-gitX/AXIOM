import React from 'react';
import { motion } from 'framer-motion';

// Vibrant gradient palettes for course cards
const GRADIENTS = [
  'from-blue-600 to-cyan-500',
  'from-violet-600 to-purple-500',
  'from-rose-500 to-orange-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-yellow-400',
  'from-pink-500 to-rose-400',
  'from-indigo-600 to-blue-500',
  'from-fuchsia-500 to-pink-500',
];

const VideoCard = ({ video, onClick }) => {
  // Deterministic gradient based on video id
  const gradientClass = GRADIENTS[video.id % GRADIENTS.length];

  return (
    <motion.div
      className="group cursor-pointer"
      whileHover={{ y: -4 }}
      onClick={() => onClick(video)}
    >
      {/* Hero Section with Gradient */}
      <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br ${gradientClass} p-5 flex flex-col justify-between shadow-lg`}>

        {/* Course Title */}
        <div className="flex-1 flex items-center justify-center">
          <h3 className="text-white text-xl md:text-2xl font-bold text-center leading-tight drop-shadow-md px-2">
            {video.title.length > 40 ? video.title.substring(0, 40) + '...' : video.title}
          </h3>
        </div>

        {/* Duration Badge */}
        <div className="self-end">
          <span className="bg-black/30 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md">
            {video.duration}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex items-center gap-3 mt-4 px-1">
        <img
          src={video.channelAvatar}
          alt={video.channel}
          className="w-9 h-9 rounded-full object-cover bg-gray-200 shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.channel)}&background=random&bold=true&size=100`
          }}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {video.title}
          </p>
          <p className="text-xs text-gray-500">
            {video.channel} • {video.views} views
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;
