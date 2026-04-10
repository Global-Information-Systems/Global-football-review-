

import React from 'react';
import { LeagueFixturesData, MatchInfo, MatchResult, UpcomingFixture } from '../types';
import { TeamLogo } from './TeamLogo';

interface FixturesDisplayProps {
  content: LeagueFixturesData | null;
  leagueName: string;
  onAnalyzeMatch: (match: MatchInfo) => void;
}

const FixturesDisplay: React.FC<FixturesDisplayProps> = ({ content, leagueName, onAnalyzeMatch }) => {
  if (!content) {
    return <p className="text-gray-400 italic mt-4">No fixture information available for {leagueName}.</p>;
  }

  const renderResultRow = (result: MatchResult, index: number) => (
    <tr key={`result-${index}`} className="hover:bg-white/5 transition-colors group">
      <td className="px-4 py-4 text-xs text-gray-500 font-mono">{result.date}</td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm font-bold text-white text-right">{result.homeTeam}</span>
          <TeamLogo teamName={result.homeTeam} className="w-6 h-6 rounded-full" />
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="inline-flex items-center justify-center px-3 py-1 bg-black/40 rounded-lg border border-white/5 font-black text-pitch-green-light">
          {result.homeScore} - {result.awayScore}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <TeamLogo teamName={result.awayTeam} className="w-6 h-6 rounded-full" />
          <span className="text-sm font-bold text-white">{result.awayTeam}</span>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <button
          onClick={() => onAnalyzeMatch({
            homeTeam: result.homeTeam,
            awayTeam: result.awayTeam,
            score: `${result.homeScore}-${result.awayScore}`,
            context: result.competition,
            isFuture: false,
            entityName: leagueName
          })}
          className="text-[10px] font-black uppercase tracking-widest text-pitch-green-light hover:text-pitch-green opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Analysis
        </button>
      </td>
    </tr>
  );

  const renderFixtureRow = (fixture: UpcomingFixture, index: number) => {
    const isLive = fixture.status === 'Live';
    
    return (
      <tr key={`fixture-${index}`} className="hover:bg-white/5 transition-colors group">
        <td className="px-4 py-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-300 font-bold">{fixture.date}</span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              🕒 {fixture.time}
            </span>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center justify-end gap-3">
            <span className="text-sm font-bold text-white text-right">{fixture.homeTeam}</span>
            <TeamLogo teamName={fixture.homeTeam} className="w-6 h-6 rounded-full shadow-sm" />
          </div>
        </td>
        <td className="px-4 py-4 text-center">
          {isLive ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-black text-rose-500 animate-pulse uppercase tracking-tighter">Live</span>
              <div className="w-1 h-1 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            </div>
          ) : (
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">vs</span>
          )}
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <TeamLogo teamName={fixture.awayTeam} className="w-6 h-6 rounded-full shadow-sm" />
            <span className="text-sm font-bold text-white">{fixture.awayTeam}</span>
          </div>
        </td>
        <td className="px-4 py-4 text-right">
          <div className="flex items-center justify-end gap-3">
            {!isLive && (
              <span className="hidden sm:inline-block text-[9px] font-bold text-blue-400/50 uppercase tracking-widest border border-blue-400/20 px-1.5 py-0.5 rounded">
                Upcoming
              </span>
            )}
            <button
              onClick={() => onAnalyzeMatch({
                homeTeam: fixture.homeTeam,
                awayTeam: fixture.awayTeam,
                context: `${fixture.competition}${fixture.venue ? ` @ ${fixture.venue}` : ''}`,
                isFuture: true,
                entityName: leagueName
              })}
              className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                isLive ? 'text-rose-400 hover:text-rose-300' : 'text-blue-400 hover:text-blue-300'
              } opacity-0 group-hover:opacity-100`}
            >
              {isLive ? 'Live Analysis' : 'Preview'}
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📅</span>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pitch-green-light to-blue-500">
          {leagueName} Fixtures & Results
        </h2>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🏆</span>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Recent Results</h3>
        </div>
        <div className="bg-chocolate/40 rounded-3xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-white/5">
              {content.recentResults.map(renderResultRow)}
            </tbody>
          </table>
          {content.recentResults.length === 0 && (
            <div className="p-8 text-center text-gray-500 italic text-sm">No recent results found.</div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📅</span>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Upcoming Fixtures</h3>
        </div>
        <div className="bg-chocolate/40 rounded-3xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-white/5">
              {content.upcomingFixtures.map(renderFixtureRow)}
            </tbody>
          </table>
          {content.upcomingFixtures.length === 0 && (
            <div className="p-8 text-center text-gray-500 italic text-sm">No upcoming fixtures found.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FixturesDisplay;
