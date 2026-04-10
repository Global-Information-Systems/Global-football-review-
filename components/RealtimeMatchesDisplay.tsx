
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RealtimeMatch, MatchInfo, GroundingSource } from '../types';
import { TeamLogo } from './TeamLogo';

interface RealtimeMatchesDisplayProps {
  matches: RealtimeMatch[] | null;
  sources?: GroundingSource[];
  title: string;
  onAnalyzeMatch: (match: MatchInfo) => void;
}

const getStatusBadge = (status: RealtimeMatch['status'], t: any) => {
  const baseClasses = "px-3 py-1 text-[10px] font-black leading-tight rounded-full uppercase tracking-widest shadow-sm";
  switch (status) {
    case 'Live':
      return <span className={`${baseClasses} text-white bg-red-600 flex items-center gap-1.5 animate-pulse`}><span className="w-1.5 h-1.5 rounded-full bg-white" />{t('live')}</span>;
    case 'HT':
      return <span className={`${baseClasses} text-yellow-900 bg-yellow-400`}>HT</span>;
    case 'FT':
      return <span className={`${baseClasses} text-white bg-gray-700`}>FT</span>;
    case 'Scheduled':
      return <span className={`${baseClasses} text-white bg-pitch-green`}>{t('upcoming')}</span>;
    case 'Postponed':
       return <span className={`${baseClasses} text-orange-200 bg-orange-900/50`}>PST</span>;
    default:
      return <span className={`${baseClasses} text-gray-400 bg-gray-800`}>{status}</span>;
  }
};

const ITEMS_PER_PAGE = 8;

const RealtimeMatchesDisplay: React.FC<RealtimeMatchesDisplayProps> = ({ matches, sources, title, onAnalyzeMatch }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  if (!matches) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-900/40 rounded-3xl border border-white/5">
        <div className="text-4xl mb-4 animate-bounce">📡</div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Searching for match data...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
        <div className="text-center bg-gray-800/50 p-12 rounded-3xl border border-dashed border-gray-700">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-2xl font-black text-white mb-2">No Active Matches</h3>
            <p className="text-gray-400">There are no {title.toLowerCase()} currently available for display.</p>
        </div>
    );
  }

  const totalPages = Math.ceil(matches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMatches = matches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <article className="space-y-6 animate-fade-in">
      <div className="bg-gray-800/40 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-gray-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🏟️</div>
            <div>
              <h3 className="text-3xl font-black text-white leading-tight">
                {title}
              </h3>
              <p className="text-xs text-pitch-green font-bold uppercase tracking-widest">
                Real-time Data Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-pitch-green/10 text-pitch-green px-4 py-1.5 rounded-full text-xs font-black border border-pitch-green/20">
              {matches.length} Total Matches
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-700/30">
          {paginatedMatches.map((match, index) => (
            <div key={startIndex + index} className="bg-chocolate/40 p-6 flex flex-col justify-between group hover:bg-pitch-green/5 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate max-w-[150px]">
                  🏆 {match.competition}
                </span>
                {getStatusBadge(match.status, t)}
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <TeamLogo teamName={match.homeTeam} className="w-12 h-12 rounded-2xl shadow-lg border border-white/5 group-hover:scale-110 transition-transform object-cover" />
                  <span className="text-sm font-black text-white text-center line-clamp-2">{match.homeTeam}</span>
                </div>

                <div className="flex flex-col items-center gap-1 px-4">
                  {match.status === 'Scheduled' ? (
                    <span className="text-xs font-bold text-pitch-green-light bg-pitch-green/10 px-3 py-1 rounded-lg">
                      {match.time}
                    </span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-white">{match.score?.split('-')[0] || 0}</span>
                      <span className="text-gray-600 font-bold">:</span>
                      <span className="text-3xl font-black text-white">{match.score?.split('-')[1] || 0}</span>
                    </div>
                  )}
                  {match.status === 'Live' && match.time && (
                    <span className="text-[10px] font-black text-red-500 animate-pulse">{match.time}'</span>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-center gap-2">
                  <TeamLogo teamName={match.awayTeam} className="w-12 h-12 rounded-2xl shadow-lg border border-white/5 group-hover:scale-110 transition-transform object-cover" />
                  <span className="text-sm font-black text-white text-center line-clamp-2">{match.awayTeam}</span>
                </div>
              </div>

              <button
                onClick={() => onAnalyzeMatch({
                  homeTeam: match.homeTeam,
                  awayTeam: match.awayTeam,
                  score: match.score,
                  context: match.competition,
                  isFuture: match.status === 'Scheduled',
                  entityName: title,
                  date: match.status === 'Scheduled' ? match.time : undefined,
                })}
                className="w-full py-2.5 rounded-xl bg-chocolate hover:bg-pitch-green text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-all border border-white/5 shadow-lg active:scale-95"
              >
                Detailed Analysis
              </button>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="bg-gray-900/80 px-8 py-4 border-t border-gray-700/50 flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'bg-chocolate hover:bg-pitch-green text-white'}`}
              >
                ⬅️
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl transition-all ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'bg-chocolate hover:bg-pitch-green text-white'}`}
              >
                ➡️
              </button>
            </div>
          </div>
        )}
      </div>

      {sources && sources.length > 0 && (
        <div className="bg-pitch-green/5 p-6 rounded-3xl border border-pitch-green/10">
          <h4 className="text-[10px] font-black text-pitch-green/60 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pitch-green" />
            Live Data Intelligence Sources
          </h4>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-chocolate/50 hover:bg-pitch-green/10 rounded-xl border border-white/5 text-xs text-gray-400 hover:text-pitch-green-light transition-all font-bold"
              >
                🔗 {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default RealtimeMatchesDisplay;
