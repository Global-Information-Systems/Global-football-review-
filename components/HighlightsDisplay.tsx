
import React from 'react';
import { LeagueHighlights, VideoHighlight } from '../types';
import { Play, Calendar, Clock, ExternalLink } from 'lucide-react';

interface HighlightsDisplayProps {
  highlights: LeagueHighlights | null;
  leagueName: string;
}

const HighlightsDisplay: React.FC<HighlightsDisplayProps> = ({ highlights, leagueName }) => {
  if (!highlights || !highlights.highlights || highlights.highlights.length === 0) {
    return <p className="text-gray-400 italic mt-4">No video highlights available for {leagueName}.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🎬</span>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pitch-green-light to-blue-500">
          {leagueName} Video Highlights
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.highlights.map((highlight: VideoHighlight, idx: number) => (
          <a 
            key={idx} 
            href={highlight.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-chocolate/40 rounded-3xl border border-white/5 overflow-hidden hover:border-pitch-green/30 transition-all flex flex-col"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={highlight.thumbnailUrl} 
                alt={highlight.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-pitch-green/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="text-white fill-white ml-1" size={32} />
                </div>
              </div>
              {highlight.duration && (
                <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-[10px] font-black text-white flex items-center gap-1">
                  <Clock size={10} /> {highlight.duration}
                </div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-pitch-green-light transition-colors line-clamp-2">
                {highlight.title}
              </h3>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                  <Calendar size={12} />
                  {highlight.date}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-pitch-green">
                  Watch Now <ExternalLink size={10} />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-[10px] text-gray-600 italic text-center mt-8">
        Highlights are sourced via AI search. Video availability may vary by region.
      </p>
    </div>
  );
};

export default HighlightsDisplay;
