import React, { useState } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { HOURLY_ENERGY_DATA } from '../mockData';

export const EnergyCalendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(11);
  const [hoveredPoint, setHoveredPoint] = useState<{ time: string; value: number } | null>(null);

  // 14 calendar cells (2 weeks matching the reference layout)
  const daysData = [
    { day: 1, intensity: 'low', kwh: 710 },
    { day: 2, intensity: 'low', kwh: 740 },
    { day: 3, intensity: 'medium', kwh: 860 },
    { day: 4, intensity: 'medium', kwh: 820 },
    { day: 5, intensity: 'low', kwh: 750 },
    { day: 6, intensity: 'weekend', kwh: 210 },
    { day: 7, intensity: 'weekend', kwh: 190 },
    { day: 8, intensity: 'medium', kwh: 830 },
    { day: 9, intensity: 'high', kwh: 1040 }, // Warning day
    { day: 10, intensity: 'high', kwh: 980 },
    { day: 11, intensity: 'today', kwh: 845.2 }, // Today
    { day: 12, intensity: 'weekend', kwh: 230 },
    { day: 13, intensity: 'weekend', kwh: 200 },
    { day: 14, intensity: 'weekend', kwh: 180 },
  ];

  return (
    <div className="bento-card rounded-2xl flex flex-col flex-1 min-h-0 border border-white/[0.08] overflow-hidden">
      {/* Header */}
      <div className="p-3 card-header-border flex justify-between items-center bg-[#09090b]/60 backdrop-blur-md shrink-0">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          能耗日历概览
        </h2>
        <div className="text-[10px] bg-white/[0.04] px-2.5 py-0.5 rounded-full text-zinc-300 font-mono border border-white/[0.08]">
          2026年09月
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 flex-grow min-h-0 justify-between bg-black/20">
        {/* Heatmap Mini Calendar */}
        <div className="shrink-0">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center mb-1">
            {['一', '二', '三', '四', '五', '六', '日'].map((w, idx) => (
              <div key={idx} className="text-[9px] text-zinc-400 font-medium">
                {w}
              </div>
            ))}
          </div>

          {/* Calendar Day Tiles */}
          <div className="grid grid-cols-7 gap-1.5">
            {daysData.map((item) => {
              const isSelected = selectedDay === item.day;
              let bgStyle = 'bg-white/[0.04] hover:bg-white/[0.08]';
              let borderStyle = 'border-white/[0.06]';

              if (item.intensity === 'today') {
                bgStyle = 'bg-indigo-600 hover:bg-indigo-500';
                borderStyle = 'border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]';
              } else if (item.intensity === 'high') {
                bgStyle = 'bg-amber-500/25 hover:bg-amber-500/40';
                borderStyle = 'border-amber-500/30';
              } else if (item.intensity === 'medium') {
                bgStyle = 'bg-indigo-500/20 hover:bg-indigo-500/35';
                borderStyle = 'border-indigo-500/25';
              } else if (item.intensity === 'weekend') {
                bgStyle = 'bg-white/[0.02] hover:bg-white/[0.05]';
                borderStyle = 'border-white/[0.04]';
              }

              return (
                <div
                  key={item.day}
                  onClick={() => setSelectedDay(item.day)}
                  title={`9月${item.day}日 能耗: ${item.kwh} kWh`}
                  className={`aspect-square rounded-lg border cursor-pointer transition-all flex items-center justify-center text-[9px] font-mono ${
                    isSelected ? 'ring-2 ring-indigo-400' : ''
                  } ${bgStyle} ${borderStyle} ${
                    item.intensity === 'today' ? 'text-white font-bold' : 'text-zinc-300'
                  }`}
                >
                  {item.day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today Trend Line Chart */}
        <div className="pt-2 border-t border-white/[0.08] flex-grow flex flex-col justify-end min-h-0">
          <div className="flex justify-between items-end mb-1.5 shrink-0">
            <span className="text-[10px] text-zinc-300 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3 h-3 text-indigo-400" />
              今日用电走势 (24h)
            </span>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/30 font-medium">
              {hoveredPoint ? `${hoveredPoint.time}: ${hoveredPoint.value} kWh` : '峰值: 14:00 (92 kWh)'}
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="relative flex-grow min-h-[55px] w-full">
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 100 40"
            >
              <defs>
                <linearGradient id="curveBentoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Reference Lines */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="2,2" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="2,2" />

              {/* Area */}
              <path
                d="M0 30 L10 32 L20 28 L30 25 L40 10 L50 15 L60 8 L70 20 L80 22 L90 25 L100 28 L100 40 L0 40 Z"
                fill="url(#curveBentoGrad)"
              />

              {/* Line */}
              <path
                d="M0 30 L10 32 L20 28 L30 25 L40 10 L50 15 L60 8 L70 20 L80 22 L90 25 L100 28"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Current/Peak marker at 14:00 (X=60) */}
              <line
                x1="60"
                x2="60"
                y1="0"
                y2="40"
                stroke="#a5b4fc"
                strokeDasharray="2,2"
                strokeWidth="1"
              />
              <circle cx="60" cy="8" r="3" fill="#818cf8" className="animate-ping" />
              <circle cx="60" cy="8" r="2.5" fill="#ffffff" stroke="#6366f1" strokeWidth="1" />

              {/* Interactive Hover Nodes */}
              {HOURLY_ENERGY_DATA.map((pt, i) => {
                const cx = (i / (HOURLY_ENERGY_DATA.length - 1)) * 100;
                const cy = 40 - (pt.value / 100) * 35;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="transparent"
                    className="cursor-pointer hover:fill-[#818cf8]"
                    onMouseEnter={() => setHoveredPoint({ time: pt.time, value: pt.value })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Time Labels */}
          <div className="flex justify-between text-[8px] font-mono text-zinc-400 mt-1 shrink-0">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
