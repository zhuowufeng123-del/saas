import React from 'react';
import { AlarmItem } from '../types';
import { AlertCircle, ChevronRight, BellRing } from 'lucide-react';

interface AlarmListProps {
  alarms: AlarmItem[];
  onSelectClassroom: (roomId: string) => void;
  onClearAlarm?: (alarmId: string) => void;
}

export const AlarmList: React.FC<AlarmListProps> = ({ alarms, onSelectClassroom }) => {
  return (
    <div className="bento-card rounded-2xl h-[42%] flex flex-col min-h-0 shrink-0 border border-white/[0.08] overflow-hidden">
      {/* Header */}
      <div className="p-3 card-header-border flex justify-between items-center bg-[#09090b]/60 backdrop-blur-md shrink-0">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <BellRing className="w-3.5 h-3.5 text-rose-400" />
          实时告警
          <span className="bg-rose-500/20 text-rose-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border border-rose-500/30">
            {alarms.length}
          </span>
        </h2>
        <span className="text-[10px] text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors">
          历史记录 &gt;
        </span>
      </div>

      {/* Alarms Feed */}
      <div className="flex-grow overflow-y-auto p-2.5 flex flex-col gap-2 bg-black/20">
        {alarms.map((alarm) => {
          const isCritical = alarm.level === 'critical';
          return (
            <div
              key={alarm.id}
              onClick={() => onSelectClassroom(alarm.roomId)}
              className={`border-l-2 ${
                isCritical
                  ? 'border-l-rose-500 bg-rose-500/[0.04] hover:bg-rose-500/[0.08]'
                  : 'border-l-amber-500 bg-amber-500/[0.04] hover:bg-amber-500/[0.08]'
              } border border-white/[0.06] p-2.5 rounded-xl flex flex-col gap-1 transition-all cursor-pointer group hover:translate-x-0.5`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded-md font-semibold ${
                      isCritical
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {alarm.typeText}
                  </span>
                  <span className="text-xs text-white font-medium group-hover:text-indigo-400 transition-colors">
                    {alarm.title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-zinc-400 font-mono">{alarm.timeAgo}</span>
                  <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
              <span className="text-[11px] text-zinc-400 pl-1 line-clamp-1 leading-relaxed">
                {alarm.description}
              </span>
            </div>
          );
        })}

        {alarms.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-xs py-4">
            <span>暂无活跃告警，所有系统正常</span>
          </div>
        )}
      </div>
    </div>
  );
};
