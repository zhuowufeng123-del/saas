import React, { useState, useEffect } from 'react';
import { MEDIA_ASSETS } from '../mockData';
import { Maximize, Minimize, Bell, RefreshCw, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  alarmCount: number;
  onOpenAlarmsDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, alarmCount, onOpenAlarmsDrawer }) => {
  const [timeString, setTimeString] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTimeString(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="w-full h-[72px] px-6 flex items-center justify-between shrink-0 bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/[0.08] z-50 relative">
      {/* Left Brand */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={MEDIA_ASSETS.logo}
            alt="睿校园 Logo"
            className="h-9 w-9 object-contain rounded-xl shadow-lg border border-white/15 bg-white/5 p-0.5"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              睿校园
            </span>
            <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold tracking-wider">
              Bento OS
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 tracking-wider uppercase">Smart Campus Cockpit</span>
        </div>
      </div>

      {/* Center Title */}
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-indigo-400 hidden sm:inline" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-indigo-200">
            睿校园数据驾驶舱
          </h1>
        </div>
        <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent mt-1"></div>
      </div>

      {/* Right Tools & Clock */}
      <div className="flex items-center gap-2.5">
        {/* Quick Alarm Button */}
        <button
          id="header-alarm-btn"
          onClick={onOpenAlarmsDrawer}
          className="relative p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] hover:border-white/20 transition-all shadow-sm"
          title="告警通知"
        >
          <Bell className="w-4 h-4 text-rose-400" />
          {alarmCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-md animate-pulse">
              {alarmCount}
            </span>
          )}
        </button>

        {/* Refresh Button */}
        <button
          id="header-refresh-btn"
          onClick={onRefresh}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] hover:border-white/20 transition-all shadow-sm"
          title="刷新数据"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400 hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          id="header-fullscreen-btn"
          onClick={toggleFullscreen}
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] hover:border-white/20 transition-all shadow-sm"
          title={isFullscreen ? '退出全屏' : '全屏显示'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4 text-zinc-300" /> : <Maximize className="w-4 h-4 text-zinc-300" />}
        </button>

        {/* Live Clock */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-200 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/[0.08] shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span id="real-time-clock" className="tracking-wide">{timeString}</span>
        </div>
      </div>
    </header>
  );
};
