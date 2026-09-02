import React, { useState } from 'react';
import { Classroom } from '../types';
import { Box, Grid, RotateCcw, RotateCw, RefreshCw, Layers, Sparkles } from 'lucide-react';

interface Classroom3DViewProps {
  classrooms: Classroom[];
  selectedClassroomId?: string | null;
  onSelectClassroom: (roomId: string) => void;
}

export const Classroom3DView: React.FC<Classroom3DViewProps> = ({
  classrooms,
  selectedClassroomId,
  onSelectClassroom,
}) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [rotationZ, setRotationZ] = useState<number>(-28);
  const [rotationX, setRotationX] = useState<number>(58);
  const [scale, setScale] = useState<number>(0.88);
  const [hoveredRoom, setHoveredRoom] = useState<Classroom | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const resetView = () => {
    setRotationZ(-28);
    setRotationX(58);
    setScale(0.88);
  };

  const rotateLeft = () => setRotationZ((prev) => prev - 15);
  const rotateRight = () => setRotationZ((prev) => prev + 15);
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 1.25));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.65));

  // Get status class for styling
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'good':
        return 'status-good';
      case 'normal':
        return 'status-normal';
      case 'warning':
        return 'status-warning';
      case 'critical':
        return 'status-critical';
      default:
        return 'status-normal';
    }
  };

  return (
    <div className="bento-card rounded-2xl flex-grow flex flex-col min-h-0 relative border border-white/[0.08] overflow-hidden">
      {/* Header Bar */}
      <div className="p-3.5 px-4 card-header-border flex justify-between items-center z-20 bg-[#09090b]/60 backdrop-blur-md shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              3D 空间能耗拓扑视图
            </h2>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase tracking-wider">
              综合教学楼
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            实时空间能效监控 · 点击任意教室立方体展开全维档案
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Status Filter Chips */}
          <div className="hidden lg:flex items-center bg-white/[0.04] rounded-full p-1 border border-white/[0.08] mr-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-0.5 text-[11px] rounded-full transition-all font-medium ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterStatus('critical')}
              className={`px-2.5 py-0.5 text-[11px] rounded-full transition-all font-medium ${
                filterStatus === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              告警
            </button>
            <button
              onClick={() => setFilterStatus('warning')}
              className={`px-2.5 py-0.5 text-[11px] rounded-full transition-all font-medium ${
                filterStatus === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              高耗
            </button>
          </div>

          {/* 3D / 2D Toggle Switch */}
          <div className="flex bg-white/[0.04] rounded-full p-1 border border-white/[0.08]">
            <button
              id="view-mode-3d-btn"
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 transition-all ${
                viewMode === '3d'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              3D
            </button>
            <button
              id="view-mode-2d-btn"
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 transition-all ${
                viewMode === '2d'
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              2D
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-grow relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#070709] to-[#040406] overflow-hidden select-none">
        {/* Ambient Glow */}
        <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Background Grid Lines with Perspective */}
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99, 102, 241, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            transform: 'perspective(900px) rotateX(60deg) scale(2.2) translateY(-40px)',
          }}
        />

        {/* View Controls Toolbar (Floating Top Right) */}
        {viewMode === '3d' && (
          <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-black/60 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-xl">
            <button
              onClick={rotateLeft}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="向左旋转"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={rotateRight}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="向右旋转"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={zoomIn}
              className="px-2 py-0.5 text-xs font-mono font-bold rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="放大"
            >
              +
            </button>
            <button
              onClick={zoomOut}
              className="px-2 py-0.5 text-xs font-mono font-bold rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="缩小"
            >
              -
            </button>
            <button
              onClick={resetView}
              className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="重置视角"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3D Isometric Scene */}
        {viewMode === '3d' ? (
          <div className="iso-container w-full h-full flex items-center justify-center z-10 relative mt-4">
            <div
              className="iso-scene w-[560px] h-[390px] relative transition-transform duration-300"
              style={{
                transform: `rotateX(${rotationX}deg) rotateZ(${rotationZ}deg) scale(${scale})`,
              }}
            >
              {/* Floor Base Area Grid */}
              <div className="absolute inset-0 border border-indigo-500/20 bg-indigo-500/5 rounded-xl pointer-events-none shadow-inner" />

              {/* Group 1 Marker: 教学楼1 */}
              <div
                className="absolute text-indigo-400 font-bold text-xs pointer-events-none tracking-wider bg-black/80 px-2.5 py-0.5 rounded-full border border-indigo-500/30 shadow-lg backdrop-blur-sm"
                style={{
                  transform:
                    'translate3d(20px, 15px, 0) rotateZ(30deg) rotateX(90deg) translateY(-15px)',
                }}
              >
                教学楼1 (初中部)
              </div>

              {/* Group 2 Marker: 教学楼2 */}
              <div
                className="absolute text-indigo-400 font-bold text-xs pointer-events-none tracking-wider bg-black/80 px-2.5 py-0.5 rounded-full border border-indigo-500/30 shadow-lg backdrop-blur-sm"
                style={{
                  transform:
                    'translate3d(350px, 15px, 0) rotateZ(30deg) rotateX(90deg) translateY(-15px)',
                }}
              >
                教学楼2 (高中部)
              </div>

              {/* Group 3 Marker: 教学楼3 */}
              <div
                className="absolute text-indigo-400 font-bold text-xs pointer-events-none tracking-wider bg-black/80 px-2.5 py-0.5 rounded-full border border-indigo-500/30 shadow-lg backdrop-blur-sm"
                style={{
                  transform:
                    'translate3d(140px, -75px, 0) rotateZ(30deg) rotateX(90deg) translateY(-15px)',
                }}
              >
                教学楼3 (学术中心)
              </div>

              {/* Render all Classroom 3D Blocks */}
              {classrooms.map((room) => {
                const isSelected = selectedClassroomId === room.id;
                const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
                const statusClass = getStatusClass(room.status);

                return (
                  <div
                    key={room.id}
                    id={`classroom-block-${room.id}`}
                    data-room-id={room.id}
                    onClick={() => onSelectClassroom(room.id)}
                    onMouseEnter={() => setHoveredRoom(room)}
                    onMouseLeave={() => setHoveredRoom(null)}
                    className={`box-container ${statusClass} ${isSelected ? 'selected' : ''} ${
                      !matchesFilter ? 'opacity-20' : 'opacity-100'
                    }`}
                    style={{
                      top: `${room.isoPosition.y}px`,
                      left: `${room.isoPosition.x}px`,
                    }}
                  >
                    <div className="box-face box-front" />
                    <div className="box-face box-right" />
                    <div className="box-face box-top" />
                    <div className="box-label">{room.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 2D Flat Floor Plan View */
          <div className="w-full h-full p-6 flex flex-col justify-center items-center z-10 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl w-full">
              {classrooms.map((room) => {
                const isSelected = selectedClassroomId === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => onSelectClassroom(room.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-white/[0.04] backdrop-blur-xl hover:scale-102 flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-400 shadow-[0_0_16px_rgba(99,102,241,0.4)] bg-indigo-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white">{room.name}</span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          room.status === 'good'
                            ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                            : room.status === 'normal'
                            ? 'bg-indigo-400 shadow-[0_0_6px_#6366f1]'
                            : room.status === 'warning'
                            ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
                            : 'bg-rose-400 shadow-[0_0_8px_#f43f5e]'
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-baseline mt-2.5 text-[11px] text-zinc-400">
                      <span>{room.building}</span>
                      <span className="font-mono text-white font-semibold">
                        {room.powerWatts} W
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hover Tooltip Overlay (when hovering a 3D box) */}
        {hoveredRoom && (
          <div className="absolute bottom-16 right-4 z-40 bg-[#09090b]/95 backdrop-blur-2xl p-4 rounded-2xl border border-white/15 shadow-2xl max-w-xs pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-2.5">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  {hoveredRoom.name}
                  <span className="text-[10px] text-indigo-400 font-mono font-normal">
                    ({hoveredRoom.roomCode})
                  </span>
                </h4>
                <p className="text-[10px] text-zinc-400">{hoveredRoom.building}</p>
              </div>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${
                  hoveredRoom.status === 'good'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : hoveredRoom.status === 'normal'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : hoveredRoom.status === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {hoveredRoom.statusText.split('·')[0]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-zinc-400">实时功率:</span>
                <span className="font-mono text-white font-bold ml-1">
                  {hoveredRoom.powerWatts} W
                </span>
              </div>
              <div>
                <span className="text-zinc-400">今日用电:</span>
                <span className="font-mono text-white font-bold ml-1">
                  {hoveredRoom.todayKwh} kWh
                </span>
              </div>
              <div>
                <span className="text-zinc-400">室内温度:</span>
                <span className="font-mono text-emerald-400 font-bold ml-1">
                  {hoveredRoom.temperature}°C
                </span>
              </div>
              <div>
                <span className="text-zinc-400">当前课程:</span>
                <span className="text-white ml-1">{hoveredRoom.currentSubject}</span>
              </div>
            </div>
            <div className="mt-2.5 text-[10px] text-indigo-400 text-right font-medium flex items-center justify-end gap-1">
              <Sparkles className="w-3 h-3" /> 点击进入教室全维档案
            </div>
          </div>
        )}

        {/* Legend at Bottom Left */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-3 text-xs bg-black/70 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
          <span className="text-[11px] text-zinc-400 font-semibold">状态图例:</span>
          <div className="flex items-center gap-1.5 text-zinc-200">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_6px_#10b981]" />
            <span className="text-[11px]">节能</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-200">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_6px_#6366f1]" />
            <span className="text-[11px]">正常</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-200">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_6px_#f59e0b]" />
            <span className="text-[11px]">异常</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-200">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e] animate-pulse" />
            <span className="text-[11px]">告警</span>
          </div>
        </div>
      </div>
    </div>
  );
};
