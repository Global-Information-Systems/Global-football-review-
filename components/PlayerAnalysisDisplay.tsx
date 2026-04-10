
import React from 'react';
import { PlayerAnalysisData } from '../types';
import { motion } from 'motion/react';
import { Zap, Target, User } from 'lucide-react';

interface PlayerAnalysisDisplayProps {
  analysis: PlayerAnalysisData | null;
  entityName: string;
}

const PlayerAnalysisDisplay: React.FC<PlayerAnalysisDisplayProps> = ({ analysis, entityName }) => {
  if (!analysis) {
    return <p className="text-gray-400 italic">No detailed analysis available for {entityName}.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🛡️</span>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          {entityName} - Player Strengths & Metrics
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analysis.keyPlayers.map((player, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gray-800/40 rounded-3xl border border-white/5 p-6 hover:border-blue-500/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{player.name}</h3>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{player.position}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap size={12} className="text-yellow-500" /> Key Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {player.strengths.map((strength, sIdx) => (
                    <span key={sIdx} className="px-3 py-1 bg-gray-900/50 border border-white/5 rounded-full text-[10px] font-bold text-gray-300">
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {player.metrics.map((metric, mIdx) => (
                  <div key={mIdx} className="bg-black/20 p-3 rounded-2xl border border-white/5 text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-tighter mb-1 truncate" title={metric.label}>
                      {metric.label}
                    </p>
                    <p className="text-sm font-black text-blue-400">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-3xl">
        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Target size={14} /> Tactical Impact Summary
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed italic">
          "{analysis.tacticalImpact}"
        </p>
      </div>
    </div>
  );
};

export default PlayerAnalysisDisplay;
