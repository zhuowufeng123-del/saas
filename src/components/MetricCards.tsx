import React from 'react';
import { DoorOpen, Zap, AlertTriangle, Boxes, CalendarX, ArrowDown, Building2, TrendingDown } from 'lucide-react';

interface MetricCardsProps {
  classroomCount?: number;
  todayElectricityKwh?: number;
  electricityDeltaPercent?: number;
  alarmCount?: number;
  deviceCount?: number;
  expiringCount?: number;
  onOpenAlarms?: () => void;
  onOpenDevices?: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  classroomCount = 13,
  todayElectricityKwh = 845.2,
  electricityDeltaPercent = -5.2,
  alarmCount = 3,
  deviceCount = 1245,
  expiringCount = 125,
  onOpenAlarms,
  onOpenDevices,
}) => {
  return (
    <div className="px-6 pt-3 pb-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 w-full shrink-0">
      {/* 1. 接入教室总数 */}
      <div className="bento-card p-4 rounded-2xl flex items-center justify-between transition-all relative overflow-hidden group">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <DoorOpen className="w-3.5 h-3.5 text-indigo-400" />
            接入教室总数
          </span>
          <div className="text-3xl font-extrabold text-white leading-none mt-2.5 font-mono tracking-tight">
            {classroomCount}
          </div>
          <span className="text-[10px] text-zinc-400 mt-1.5">覆盖1~3号教学楼</span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      {/* 2. 今日用电量 */}
      <div className="bento-card p-4 rounded-2xl flex items-center justify-between transition-all relative overflow-hidden group">
        <div className="flex flex-col flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            今日用电量 (11时)
          </span>
          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="text-3xl font-extrabold text-white leading-none font-mono tracking-tight">
              {todayElectricityKwh}
            </span>
            <span className="text-xs text-zinc-400 font-mono">kWh</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-0.5 mt-1.5">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span>{Math.abs(electricityDeltaPercent)}% 较昨日优化</span>
          </div>
        </div>

        {/* Mini Sparkline Graph */}
        <div className="w-16 h-10 shrink-0">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
            <defs>
              <linearGradient id="metricBentoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0 34 L18 26 L36 28 L56 16 L76 19 L100 6"
              fill="none"
              stroke="#818cf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0 34 L18 26 L36 28 L56 16 L76 19 L100 6 L100 40 L0 40 Z"
              fill="url(#metricBentoGrad)"
            />
            <circle cx="100" cy="6" r="3" fill="#818cf8" className="animate-ping" />
            <circle cx="100" cy="6" r="2.5" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* 3. 今日告警 */}
      <div
        onClick={onOpenAlarms}
        className="bento-card p-4 rounded-2xl flex items-center justify-between cursor-pointer group transition-all hover:border-rose-500/30 hover:bg-rose-500/[0.04]"
      >
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            今日告警
          </span>
          <div className="text-3xl font-extrabold text-rose-400 leading-none mt-2.5 font-mono flex items-center gap-2">
            {alarmCount}
            <span className="text-[9px] font-sans px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold tracking-wider">
              待办
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 mt-1.5">2 离线, 1 能耗超标</span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      {/* 4. 设备总数 */}
      <div
        onClick={onOpenDevices}
        className="bento-card p-4 rounded-2xl flex items-center justify-between transition-all cursor-pointer group"
      >
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-indigo-400" />
            设备总数
          </span>
          <div className="text-3xl font-extrabold text-white leading-none mt-2.5 font-mono tracking-tight">
            {deviceCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            在线率 98.4%
          </span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
          <Boxes className="w-5 h-5" />
        </div>
      </div>

      {/* 5. 即将过保 */}
      <div className="bento-card p-4 rounded-2xl flex items-center justify-between transition-all group">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <CalendarX className="w-3.5 h-3.5 text-amber-400" />
            即将过保
          </span>
          <div className="text-3xl font-extrabold text-white leading-none mt-2.5 font-mono tracking-tight">
            {expiringCount}
          </div>
          <span className="text-[10px] text-amber-400 mt-1.5">近30天内到期维保</span>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
          <CalendarX className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
