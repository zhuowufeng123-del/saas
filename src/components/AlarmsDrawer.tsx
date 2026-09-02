import React from 'react';
import { AlarmItem } from '../types';
import { X, AlertTriangle, CheckCircle, BellOff } from 'lucide-react';

interface AlarmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alarms: AlarmItem[];
  onSelectClassroom: (roomId: string) => void;
  onClearAlarm: (alarmId: string) => void;
}

export const AlarmsDrawer: React.FC<AlarmsDrawerProps> = ({
  isOpen,
  onClose,
  alarms,
  onSelectClassroom,
  onClearAlarm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#09090b] border-l border-white/10 w-full max-w-lg h-full flex flex-col p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">告警监控中心</h2>
              <p className="text-xs text-zinc-400">实时感知设备离线、能耗异常与环境突变</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alarm list */}
        <div className="flex-grow overflow-y-auto flex flex-col gap-3 pr-1 mt-4">
          {alarms.map((alarm) => {
            const isCritical = alarm.level === 'critical';
            return (
              <div
                key={alarm.id}
                className={`bg-white/[0.03] border ${
                  isCritical ? 'border-rose-500/40' : 'border-amber-500/40'
                } p-4 rounded-2xl flex flex-col gap-2.5 shadow-md`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {alarm.typeText}
                    </span>
                    <span className="font-bold text-sm text-white">{alarm.title}</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">{alarm.timeAgo}</span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/[0.06]">
                  {alarm.description}
                </p>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <button
                    onClick={() => {
                      onSelectClassroom(alarm.roomId);
                      onClose();
                    }}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer transition-colors"
                  >
                    定位到所在教室 &gt;
                  </button>
                  <button
                    onClick={() => onClearAlarm(alarm.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-300 hover:text-white flex items-center gap-1.5 text-xs transition-colors border border-white/10 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    标记已处理
                  </button>
                </div>
              </div>
            );
          })}

          {alarms.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-500 text-xs gap-2">
              <BellOff className="w-8 h-8 opacity-50" />
              <span>当前所有教室与设备运行平稳，无活动告警</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
