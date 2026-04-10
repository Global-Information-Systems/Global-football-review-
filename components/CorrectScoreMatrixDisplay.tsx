
import React from 'react';
import { CorrectScoreMatrix, ScoreProbability } from '../types';

interface CorrectScoreMatrixDisplayProps {
  data: CorrectScoreMatrix | null;
  isLoading: boolean;
}

const CorrectScoreMatrixDisplay: React.FC<CorrectScoreMatrixDisplayProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="w-8 h-8 border-4 border-pitch-green/20 border-t-pitch-green rounded-full animate-spin" />
        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Calculating Probabilities...</p>
      </div>
    );
  }

  if (!data || !data.matrix || data.matrix.length === 0) {
    return null;
  }

  // Sort by probability descending
  const sortedMatrix = [...data.matrix].sort((a, b) => b.probability - a.probability);
  const maxProb = Math.max(...sortedMatrix.map(s => s.probability));

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📊</span>
        <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">AI Correct Score Matrix</h4>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {sortedMatrix.map((item: ScoreProbability, idx: number) => (
          <div 
            key={idx} 
            className="bg-chocolate/40 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center group hover:border-pitch-green/30 transition-all"
          >
            <span className="text-lg font-black text-white mb-1 group-hover:text-pitch-green-light transition-colors">
              {item.score}
            </span>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mb-1">
              <div 
                className="h-full bg-pitch-green transition-all duration-1000"
                style={{ width: `${(item.probability / maxProb) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-gray-500">
              {item.probability}%
            </span>
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-[9px] text-gray-600 italic text-center leading-tight">
        Matrix represents AI-calculated likelihoods based on current form, historical data, and tactical matchups.
      </p>
    </div>
  );
};

export default CorrectScoreMatrixDisplay;
