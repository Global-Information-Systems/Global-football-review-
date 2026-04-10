
import React from 'react';
import { PlayerStatsData, PlayerStat } from '../types';

interface PlayerStatsDisplayProps {
  stats: PlayerStatsData | null;
  entityName: string;
}

const PlayerStatsDisplay: React.FC<PlayerStatsDisplayProps> = ({ stats, entityName }) => {
  if (!stats) {
    return <p className="text-gray-400 italic">No statistics available for {entityName}.</p>;
  }

  const renderStatTable = (title: string, data: PlayerStat[], icon: string, metric: keyof PlayerStat) => (
    <div className="bg-gray-800/50 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 bg-gray-700/30 border-b border-white/5 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h4 className="text-sm font-black uppercase tracking-widest text-pitch-green-light">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-white/5">
              <th className="p-3 font-black uppercase tracking-tighter">Player</th>
              <th className="p-3 font-black uppercase tracking-tighter">Team</th>
              <th className="p-3 font-black uppercase tracking-tighter text-right">{String(metric)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((player, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-bold text-white">{player.name}</td>
                <td className="p-3 text-gray-400">{player.team}</td>
                <td className="p-3 text-right font-black text-pitch-green">{player[metric]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📈</span>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
          {entityName} - Player Statistics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderStatTable("Top Scorers", stats.topScorers, "⚽", "goals")}
        {renderStatTable("Top Assisters", stats.topAssisters, "🎯", "assists")}
      </div>

      <div className="max-w-2xl">
        {renderStatTable("Most Appearances", stats.mostAppearances, "🏃", "appearances")}
      </div>
    </div>
  );
};

export default PlayerStatsDisplay;
