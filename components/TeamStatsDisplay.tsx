
import React from 'react';
import { LeagueTeamStats, TeamStats } from '../types';
import { TeamLogo } from './TeamLogo';
import { Activity, Zap } from 'lucide-react';

interface TeamStatsDisplayProps {
  stats: LeagueTeamStats | null;
  leagueName: string;
}

const TeamStatsDisplay: React.FC<TeamStatsDisplayProps> = ({ stats, leagueName }) => {
  if (!stats || !stats.teams || stats.teams.length === 0) {
    return <p className="text-gray-400 italic mt-4">No detailed team statistics available for {leagueName}.</p>;
  }

  const [sortConfig, setSortConfig] = React.useState<{ key: keyof TeamStats | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'desc' });

  const sortedTeams = React.useMemo(() => {
    if (!stats?.teams) return [];
    
    let sortableTeams = [...stats.teams];
    if (sortConfig.key !== null) {
      sortableTeams.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof TeamStats];
        const bValue = b[sortConfig.key as keyof TeamStats];
        
        if (aValue === bValue) return 0;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
    }
    return sortableTeams;
  }, [stats?.teams, sortConfig]);

  const requestSort = (key: keyof TeamStats) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof TeamStats }) => {
    if (sortConfig.key !== columnKey) return <span className="ml-1 opacity-30">↕</span>;
    return <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📊</span>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
          {leagueName} Team Statistics
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Teams by Possession */}
        <div className="bg-gray-800/40 rounded-3xl border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-blue-400" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Average Possession</h3>
          </div>
          <div className="space-y-4">
            {[...stats.teams].sort((a, b) => b.possession - a.possession).slice(0, 5).map((team: TeamStats, idx: number) => (
              <div key={idx} className="flex items-center gap-4">
                <TeamLogo teamName={team.teamName} className="w-8 h-8 rounded-full" />
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">{team.teamName}</span>
                    <span className="text-xs font-black text-blue-400">{team.possession}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${team.possession}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Teams by Pass Accuracy */}
        <div className="bg-gray-800/40 rounded-3xl border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-pitch-green-light" size={20} />
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Pass Accuracy</h3>
          </div>
          <div className="space-y-4">
            {[...stats.teams].sort((a, b) => b.passAccuracy - a.passAccuracy).slice(0, 5).map((team: TeamStats, idx: number) => (
              <div key={idx} className="flex items-center gap-4">
                <TeamLogo teamName={team.teamName} className="w-8 h-8 rounded-full" />
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">{team.teamName}</span>
                    <span className="text-xs font-black text-pitch-green-light">{team.passAccuracy}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-pitch-green transition-all duration-1000"
                      style={{ width: `${team.passAccuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/40 rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4 cursor-pointer hover:text-white" onClick={() => requestSort('teamName')}>Team <SortIcon columnKey="teamName" /></th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white" onClick={() => requestSort('shotsOnTarget')}>Shots OT <SortIcon columnKey="shotsOnTarget" /></th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white" onClick={() => requestSort('defensiveClearances')}>Clearances <SortIcon columnKey="defensiveClearances" /></th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white" onClick={() => requestSort('goalsScored')}>Goals <SortIcon columnKey="goalsScored" /></th>
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white" onClick={() => requestSort('cleanSheets')}>Clean Sheets <SortIcon columnKey="cleanSheets" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedTeams.map((team: TeamStats, idx: number) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <TeamLogo teamName={team.teamName} className="w-6 h-6 rounded-full" />
                      <span className="text-sm font-bold text-white">{team.teamName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-black text-white">{team.shotsOnTarget}</span>
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Per Match</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-black text-white">{team.defensiveClearances}</span>
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Per Match</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-black text-pitch-green-light">{team.goalsScored}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-black text-blue-400">{team.cleanSheets}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamStatsDisplay;
