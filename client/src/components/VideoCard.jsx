import React from 'react';
import { Play } from 'lucide-react';

// Painterly-cream theme card backgrounds — soft, paper-warm, on-brand.
// Each card pulls a tinted "fabric" tone instead of the previous Y2K rainbow.
const SURFACES = [
  { bg: '#E8F2E5', accent: '#0E334F' }, // sage
  { bg: '#FBEFE0', accent: '#7A4A1F' }, // peach
  { bg: '#E5E8F2', accent: '#0E334F' }, // mist
  { bg: '#F2E5EC', accent: '#7A1F4A' }, // rose-dust
  { bg: '#EDE7DC', accent: '#3a2e2a' }, // sand
  { bg: '#DCE8E5', accent: '#0E334F' }, // teal-fade
  { bg: '#F2EFE7', accent: '#0F1419' }, // paper-soft
  { bg: '#E6E2F2', accent: '#3F2E7A' }, // dusk
];

const VideoCard = ({ video, onClick }) => {
  const surface = SURFACES[video.id % SURFACES.length];

  return (
    <div
      className="group cursor-pointer transition-transform duration-300 hover:-translate-y-0.5"
      onClick={() => onClick(video)}
    >
      {/* Card surface — flat painterly tint, no gradients */}
      <div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden p-5 flex flex-col justify-between border border-black/[0.06] shadow-[0_2px_4px_rgba(15,20,25,0.02),0_8px_24px_-12px_rgba(15,20,25,0.06)] group-hover:shadow-[0_2px_4px_rgba(15,20,25,0.02),0_24px_48px_-16px_rgba(15,20,25,0.12)] transition-shadow duration-500"
        style={{ background: surface.bg }}
      >
        {/* Subtle play affordance — appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-[0_8px_24px_rgba(15,20,25,0.18)]">
            <Play className="w-5 h-5 text-[#0F1419] fill-[#0F1419] ml-0.5" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-2">
          <h3
            className="font-display text-[18px] md:text-[20px] font-semibold leading-tight text-center tracking-[-0.018em]"
            style={{ color: surface.accent }}
          >
            {video.title.length > 40 ? video.title.substring(0, 40) + '…' : video.title}
          </h3>
        </div>

        {/* Duration pill */}
        <div className="self-end">
          <span className="bg-[#FAF8F2]/85 backdrop-blur-sm text-[#0F1419] text-[11px] font-medium px-2.5 py-1 rounded-full border border-black/[0.06] tabular-nums">
            {video.duration}
          </span>
        </div>
      </div>

      {/* Channel + meta */}
      <div className="flex items-center gap-3 mt-3.5 px-1">
        <img
          src={video.channelAvatar}
          alt={video.channel}
          className="w-9 h-9 rounded-full object-cover bg-[#F2EFE7] shrink-0 border border-black/[0.06]"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              video.channel
            )}&background=F2EFE7&color=0F1419&bold=true&size=100`;
          }}
        />
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-[#0F1419] truncate group-hover:text-[#0E334F] transition-colors">
            {video.title}
          </p>
          <p className="text-[12px] text-[#0F1419]/55 truncate">
            {video.channel} · {video.views} views
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
