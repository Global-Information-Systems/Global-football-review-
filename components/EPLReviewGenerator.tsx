
import React, { useState } from 'react';
import { EPL_TEAMS, SEASONS } from '../constants';
import * as geminiService from '../services/geminiService';
import { Loader2, Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InteractiveText from './InteractiveText';

interface EPLReviewGeneratorProps {
  onPlayerClick: (playerName: string) => void;
}

const EPLReviewGenerator: React.FC<EPLReviewGeneratorProps> = ({ onPlayerClick }) => {
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReview, setGeneratedReview] = useState<string | null>(null);
  const [showTeamSelector, setShowTeamSelector] = useState(false);

  const toggleTeam = (team: string) => {
    setSelectedTeams(prev => 
      prev.includes(team) 
        ? prev.filter(t => t !== team) 
        : [...prev, team]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedReview(null);
    try {
      const review = await geminiService.fetchEPLReview(selectedSeason, selectedTeams);
      setGeneratedReview(review);
    } catch (error) {
      console.error("Error generating EPL review:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 bg-gray-900/40 p-6 rounded-3xl border border-white/5">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Season Selector */}
        <div className="w-full md:w-1/3 space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Season</label>
          <select 
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full bg-chocolate border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-pitch-green transition-colors"
          >
            {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Team Selector */}
        <div className="w-full md:w-2/3 space-y-2 relative">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Highlight Specific Teams</label>
          <button 
            onClick={() => setShowTeamSelector(!showTeamSelector)}
            className="w-full bg-chocolate border border-white/10 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between hover:border-pitch-green/50 transition-colors"
          >
            <span className="truncate">
              {selectedTeams.length === 0 ? "All Teams" : `${selectedTeams.length} Teams Selected`}
            </span>
            {showTeamSelector ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <AnimatePresence>
            {showTeamSelector && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/10 rounded-2xl shadow-2xl z-50 p-4 max-h-60 overflow-y-auto custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {EPL_TEAMS.map(team => (
                  <button
                    key={team}
                    onClick={() => toggleTeam(team)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                      selectedTeams.includes(team) 
                        ? 'bg-pitch-green/20 text-pitch-green-light border border-pitch-green/30' 
                        : 'text-gray-400 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {team}
                    {selectedTeams.includes(team) && <Check size={12} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full bg-pitch-green hover:bg-pitch-green-light disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pitch-green-dark/20 transition-all flex items-center justify-center gap-3"
      >
        {isGenerating ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Sparkles size={18} />
        )}
        {isGenerating ? "Generating Custom Review..." : "Generate AI EPL Review"}
      </button>

      {generatedReview && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 pt-8 border-t border-white/5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-pitch-green rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-widest text-pitch-green">Custom Review: {selectedSeason}</h3>
          </div>
          <div className="bg-gray-900/60 p-6 rounded-3xl border border-white/5">
            <InteractiveText text={generatedReview} onPlayerClick={onPlayerClick} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EPLReviewGenerator;
