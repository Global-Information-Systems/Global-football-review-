

import React from 'react';
import { BettingInfo, Prediction } from '../types';
import { TeamLogo } from './TeamLogo';
import { AlertTriangle, TrendingUp, Target, Info } from 'lucide-react';

interface BettingStrategyDisplayProps {
  content: BettingInfo | null;
  leagueName: string;
}

const BettingStrategyDisplay: React.FC<BettingStrategyDisplayProps> = ({ content, leagueName }) => {
  if (!content) {
    return <p className="text-gray-400 italic mt-4">No betting analysis available for {leagueName}.</p>;
  }

  const { strategicAdvice, odds, predictions } = content;

  const adviceParagraphs = strategicAdvice.split(/\n\n|\n/).map((p: string) => p.trim()).filter(Boolean);

  const getConfidenceColor = (score: number) => {
    if (score >= 75) return 'text-pitch-green-light';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getConfidenceBg = (score: number) => {
    if (score >= 75) return 'bg-pitch-green/10 border-pitch-green/20';
    if (score >= 50) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🎲</span>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          {leagueName} Betting Analysis
        </h2>
      </div>

      {/* Strategic Advice */}
      <section className="bg-gray-800/40 rounded-3xl border border-white/5 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-amber-400" />
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Strategic Insights</h3>
        </div>
        <div className="prose prose-sm prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
          {adviceParagraphs.map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Predictions */}
      {predictions && predictions.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-pitch-green-light" />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Match Predictions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((pred: Prediction, idx: number) => (
              <div key={idx} className="bg-gray-900/60 border border-white/5 rounded-2xl p-4 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TeamLogo teamName={pred.homeTeam} className="w-5 h-5 rounded-full" />
                    <span className="text-xs font-bold text-white truncate max-w-[80px]">{pred.homeTeam}</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-600">VS</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate max-w-[80px]">{pred.awayTeam}</span>
                    <TeamLogo teamName={pred.awayTeam} className="w-5 h-5 rounded-full" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">AI Pick</span>
                    <span className="text-xs font-black text-pitch-green-light">{pred.predictedOutcome}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-lg border ${getConfidenceBg(pred.confidenceScore)} text-center`}>
                    <span className="text-[9px] font-black text-gray-500 uppercase block leading-none mb-1">Confidence</span>
                    <span className={`text-xs font-black ${getConfidenceColor(pred.confidenceScore)}`}>{pred.confidenceScore}%</span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 italic leading-tight border-t border-white/5 pt-3">
                  "{pred.reasoning}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Illustrative Odds */}
      {odds && odds.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Info size={18} className="text-blue-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Illustrative Match Odds</h3>
          </div>
          <div className="bg-gray-800/40 rounded-3xl border border-white/5 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <th className="px-4 py-3">Match</th>
                  <th className="px-4 py-3 text-center">1</th>
                  <th className="px-4 py-3 text-center">X</th>
                  <th className="px-4 py-3 text-center">2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {odds.map((match: any, index: number) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{match.homeTeam} vs {match.awayTeam}</span>
                        <span className="text-[10px] text-gray-500">{match.matchDate || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-mono text-amber-400">{match.odds['1']}</td>
                    <td className="px-4 py-4 text-center text-xs font-mono text-amber-400">{match.odds['X']}</td>
                    <td className="px-4 py-4 text-center text-xs font-mono text-amber-400">{match.odds['2']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl flex gap-4 items-start">
        <AlertTriangle className="text-rose-500 shrink-0" size={20} />
        <div>
          <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">Responsible Gambling Disclaimer</h4>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            All betting analysis, odds, and predictions are AI-generated for informational and entertainment purposes only. They do not constitute financial advice or a guarantee of success. Football is unpredictable, and betting involves significant risk. Please gamble responsibly and only with money you can afford to lose. If you or someone you know has a gambling problem, please seek professional help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BettingStrategyDisplay;
