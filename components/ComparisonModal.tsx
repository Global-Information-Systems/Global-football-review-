
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlayerComparisonData, ComparisonContext } from '../types';
import * as geminiService from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { TeamLogo } from './TeamLogo';

interface ComparisonModalProps {
  playerNames: string[];
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ playerNames, onClose }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<PlayerComparisonData | null>(null);
  const [context, setContext] = useState<ComparisonContext>('current-season');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComp = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const compData = await geminiService.fetchPlayerComparison(playerNames, context);
        setData(compData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Comparison failed.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComp();
  }, [playerNames, context]);

  // Map count to specific tailwind classes to ensure they are picked up by the compiler
  const getGridColsClass = (count: number) => {
    const limitedCount = Math.min(count, 3);
    if (limitedCount === 1) return 'md:grid-cols-1 max-w-xl mx-auto';
    if (limitedCount === 2) return 'md:grid-cols-2 max-w-4xl mx-auto';
    return 'md:grid-cols-3';
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[70] p-4 sm:p-8">
      <div className="bg-gray-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-2xl">⚔️</span>
            {t('head_to_head')}
          </h2>
          <div className="flex items-center gap-4">
            <select 
              value={context} 
              onChange={(e) => setContext(e.target.value as ComparisonContext)}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-white/10"
            >
              <option value="current-season">Current Season</option>
              <option value="all-time">All Time</option>
            </select>
            <button onClick={onClose} className="text-2xl hover:scale-110 transition-transform">
              ❌
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <LoadingSpinner />
              <p className="mt-4 text-gray-400 font-medium animate-pulse">Gemini is analyzing tactical profiles...</p>
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : data ? (
            <div className="space-y-8">
              {/* Overall AI Analysis */}
              <div className="bg-pitch-green/10 border border-pitch-green/20 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="text-6xl text-pitch-green font-black">AI</span>
                </div>
                <h3 className="text-pitch-green-light text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pitch-green animate-pulse" />
                  {t('expert_verdict')}
                </h3>
                <p className="text-gray-100 text-lg leading-relaxed italic relative z-10">"{data.overallAnalysis}"</p>
              </div>

              {/* Head-to-Head Section */}
              {data.headToHead && (
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4">Head-to-Head</h3>
                  <p className="text-gray-300 mb-4">{data.headToHead.record}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {data.headToHead.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-chocolate/40 p-3 rounded-xl border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{metric.label}</p>
                        <p className="text-white font-bold">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Side by Side Grid */}
              <div className={`grid grid-cols-1 gap-6 ${getGridColsClass(data.players.length)}`}>
                {data.players.map((player: any, idx: number) => {
                  // Generate a high-quality placeholder image
                  const cleanPlayerName = player.name.replace(/[^a-zA-Z0-9\s]/g, '').trim();
                  const placeholderUrl = `https://placehold.co/400x400/059669/ffffff.png?text=${encodeURIComponent(cleanPlayerName || 'Player')}`;

                  return (
                    <div key={idx} className="bg-chocolate/40 rounded-3xl border border-white/5 p-6 space-y-6 flex flex-col items-center text-center group hover:bg-pitch-green/5 transition-all">
                      {/* Player Image / Placeholder */}
                      <div className="relative">
                        <div className="h-32 w-32 rounded-full border-4 border-gray-700 bg-gray-900 overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                          <img 
                            src={placeholderUrl} 
                            alt={player.name}
                            className="w-full h-full object-cover"
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                // Fallback if placeholder fails
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanPlayerName || 'P')}&background=059669&color=fff&size=256`;
                            }}
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-gray-900 p-1 rounded-full shadow-lg border-2 border-gray-800">
                          <TeamLogo teamName={player.club} className="w-6 h-6 rounded-full object-cover" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white">{player.name}</h3>
                        <p className="text-pitch-green-light text-xs font-bold uppercase tracking-widest">{player.position} · {player.club}</p>
                      </div>

                      <div className="w-full bg-pitch-green/10 rounded-2xl p-4 border border-pitch-green/20 group-hover:border-pitch-green/40 transition-colors">
                        <p className="text-[9px] font-black text-pitch-green uppercase tracking-widest mb-1">{t('player.trait')}</p>
                        <p className="text-white text-sm font-bold leading-tight">{player.comparisonVerdict}</p>
                      </div>

                      <div className="w-full space-y-4 pt-2">
                        <div className="text-left">
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">{t('player.top_strengths')}</h4>
                          <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {player.strengths.map((s: string) => (
                              <span key={s} className="px-3 py-1 bg-chocolate/60 text-gray-300 text-[10px] font-bold rounded-lg border border-white/5 transition-colors hover:border-pitch-green/30">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-left">
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{t('player.recent_performance')}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            {player.recentPerformance}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
