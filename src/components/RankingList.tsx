import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { RANKING_DATA } from '../mockData';

interface RankingListProps {
  onSelectClassroom: (roomId: string) => void;
}

export const RankingList: React.FC<RankingListProps> = ({ onSelectClassroom }) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const rankItems = RANKING_DATA[timeRange];

  return (
    <div className="bento-card rounded-2xl flex flex-col flex-1 min-h-0 border border-white/[0.08] overflow-hidden">
      {/* Header */}
      <div className="p-3 card-header-border flex justify-between items-center bg-[#09090b]/60 backdrop-blur-md shrink-0">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          教室能耗榜
        </h2>

        {/* Time Tabs */}
        <div className="flex bg-white/[0.04] rounded-full p-0.5 gap-1 border border-white/[0.08]">
          {(['today', 'week', 'month'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeRange(tab)}
              className={`px-2.5 py-0.5 text-[10px] rounded-full transition-all font-medium ${
                timeRange === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab === 'today' ? '今日' : tab === 'week' ? '本周' : '本月'}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked List */}
      <div className="p-3 flex flex-col justify-between flex-grow min-h-0 py-2.5 gap-2 bg-black/20 overflow-y-auto">
        {rankItems.map((item) => {
          let rankColor = 'text-zinc-500';
          let barGradient = 'bg-white/10';

          if (item.rank === 1) {
            rankColor = 'text-rose-400';
            barGradient = 'bg-gradient-to-r from-indigo-500 via-rose-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
          } else if (item.rank === 2) {
            rankColor = 'text-amber-400';
            barGradient = 'bg-gradient-to-r from-indigo-500 to-amber-400';
          } else if (item.rank === 3) {
            rankColor = 'text-indigo-400';
            barGradient = 'bg-indigo-500';
          } else {
            barGradient = 'bg-white/15 hover:bg-white/25';
          }

          return (
            <div
              key={item.rank}
              onClick={() => onSelectClassroom(item.roomId)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.04] transition-colors group cursor-pointer border border-transparent hover:border-white/[0.06]"
            >
              {/* Rank Number */}
              <div className={`w-5 text-center font-mono text-sm font-black italic ${rankColor}`}>
                {item.rank}
              </div>

              {/* Classroom Name */}
              <div className="w-16 text-xs text-white font-medium truncate group-hover:text-indigo-400 transition-colors">
                {item.roomName}
              </div>

              {/* Progress Bar */}
              <div className="flex-grow h-2 bg-white/[0.06] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                <div
                  className={`h-full rounded-full transition-all duration-500 group-hover:brightness-110 ${barGradient}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              {/* Energy Value */}
              <span className="font-mono text-xs w-12 text-right text-white font-bold shrink-0">
                {item.valueKwh}k
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
