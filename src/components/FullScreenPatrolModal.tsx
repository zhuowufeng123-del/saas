import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PatrolFeed, Classroom } from '../types';
import {
  X,
  Minimize2,
  Video,
  Radio,
  Camera,
  RotateCw,
  Sliders,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Eye,
  Crosshair,
  Layers,
  FileCheck,
} from 'lucide-react';

interface FullScreenPatrolModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeds: PatrolFeed[];
  classrooms: Classroom[];
  onSelectClassroom: (roomId: string) => void;
  onOpenPatrolDialog: (classroom: Classroom) => void;
}

export const FullScreenPatrolModal: React.FC<FullScreenPatrolModalProps> = ({
  isOpen,
  onClose,
  feeds,
  classrooms,
  onSelectClassroom,
  onOpenPatrolDialog,
}) => {
  const [layout, setLayout] = useState<'4' | '6' | '9'>('6');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'junior' | 'senior'>('all');
  const [activeFocusFeed, setActiveFocusFeed] = useState<PatrolFeed | null>(null);
  const [activeCameraAngle, setActiveCameraAngle] = useState<'teacher' | 'students' | 'board'>('teacher');
  const [isAutoPolling, setIsAutoPolling] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [ptzZoom, setPtzZoom] = useState(100);
  const [quickScore, setQuickScore] = useState<'good' | 'normal' | 'warning'>('good');
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.getFullYear() +
          '-' +
          String(now.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(now.getDate()).padStart(2, '0') +
          ' ' +
          String(now.getHours()).padStart(2, '0') +
          ':' +
          String(now.getMinutes()).padStart(2, '0') +
          ':' +
          String(now.getSeconds()).padStart(2, '0')
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut: ESC to exit fullscreen or focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeFocusFeed) {
          setActiveFocusFeed(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, activeFocusFeed, onClose]);

  if (!isOpen) return null;

  // Filter feeds
  const filteredFeeds = feeds.filter((feed) => {
    if (gradeFilter === 'junior') return feed.roomName.includes('初');
    if (gradeFilter === 'senior') return feed.roomName.includes('高') || feed.roomName.includes('阶梯');
    return true;
  });

  const displayCount = layout === '4' ? 4 : layout === '6' ? 6 : 9;
  const currentFeeds = filteredFeeds.slice(0, displayCount);

  // Trigger snapshot notification
  const handleTakeSnapshot = (roomName: string) => {
    setSnapshotToast(`已捕获 [${roomName}] 实时课堂巡查高清帧并自动存入督导档案库！`);
    setTimeout(() => setSnapshotToast(null), 3000);
  };

  const selectedClassroomObj = activeFocusFeed
    ? classrooms.find((c) => c.id === activeFocusFeed.roomId)
    : null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#050505] text-zinc-100 flex flex-col overflow-hidden animate-in fade-in duration-200 select-none">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/3 w-[800px] h-[350px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/3 w-[600px] h-[350px] bg-emerald-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Snapshot Toast notification */}
      {snapshotToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4" />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* TOP COMMAND HEADER */}
      <header className="h-16 px-6 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between shrink-0 z-20">
        {/* Left: Brand & Patrol Stats */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                智慧校园全景在线巡课视讯中心
              </h1>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" /> 实时高清推流中
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
              <span className="font-mono text-zinc-300">{currentTime}</span>
              <span>•</span>
              <span>汇聚 {feeds.length} 路高清机位 (1080P/60FPS)</span>
            </div>
          </div>
        </div>

        {/* Center: Layout & Grade Selector */}
        {!activeFocusFeed && (
          <div className="flex items-center gap-3">
            {/* Grade Filter */}
            <div className="flex items-center bg-white/[0.04] p-1 rounded-full border border-white/[0.08] text-xs">
              <button
                onClick={() => setGradeFilter('all')}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  gradeFilter === 'all'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                全部学段
              </button>
              <button
                onClick={() => setGradeFilter('junior')}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  gradeFilter === 'junior'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                初中部
              </button>
              <button
                onClick={() => setGradeFilter('senior')}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  gradeFilter === 'senior'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                高中部 / 阶梯
              </button>
            </div>

            {/* Split Screen Layouts */}
            <div className="flex items-center bg-white/[0.04] p-1 rounded-full border border-white/[0.08] text-xs">
              <button
                onClick={() => setLayout('4')}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  layout === '4'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                4 分屏
              </button>
              <button
                onClick={() => setLayout('6')}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  layout === '6'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                6 分屏
              </button>
              <button
                onClick={() => setLayout('9')}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  layout === '9'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                9 分屏
              </button>
            </div>
          </div>
        )}

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {activeFocusFeed && (
            <button
              onClick={() => setActiveFocusFeed(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 text-xs font-semibold transition-colors cursor-pointer border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" /> 返回多屏矩阵
            </button>
          )}

          {/* Auto Polling Toggle */}
          {!activeFocusFeed && (
            <button
              onClick={() => setIsAutoPolling(!isAutoPolling)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                isAutoPolling
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoPolling ? 'animate-spin' : ''}`} />
              {isAutoPolling ? '自动轮巡中' : '开启自动轮巡'}
            </button>
          )}

          {/* Audio Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors border border-white/10 cursor-pointer"
            title={isMuted ? '已静音' : '已开启现场监听'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Exit Fullscreen Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Minimize2 className="w-4 h-4" />
            <span>退出全屏</span>
          </button>
        </div>
      </header>

      {/* MAIN SCREEN AREA */}
      <div className="flex-grow p-4 min-h-0 overflow-hidden flex">
        {/* VIEW 1: MULTI-CAMERA MATRIX GRID */}
        {!activeFocusFeed ? (
          <div
            className={`w-full h-full grid gap-3 ${
              layout === '4'
                ? 'grid-cols-2 grid-rows-2'
                : layout === '6'
                ? 'grid-cols-3 grid-rows-2'
                : 'grid-cols-3 grid-rows-3'
            }`}
          >
            {currentFeeds.map((feed, index) => {
              const classroom = classrooms.find((c) => c.id === feed.roomId);
              return (
                <div
                  key={feed.id}
                  className="relative rounded-2xl bg-zinc-900 overflow-hidden border border-white/10 hover:border-indigo-500/80 transition-all duration-200 group flex flex-col shadow-lg hover:shadow-[0_0_24px_rgba(99,102,241,0.25)]"
                >
                  {/* Video Player Area */}
                  <div className="relative flex-grow w-full h-full overflow-hidden bg-black">
                    <img
                      src={feed.coverImage}
                      alt={feed.roomName}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

                    {/* CCTV Overlay Top Bar */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10">
                      <div className="flex items-center gap-2">
                        <div className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-white border border-white/15 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-400" />
                          <span>{feed.roomName}</span>
                          <span className="text-indigo-400 font-normal">({feed.subject})</span>
                        </div>
                        <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-zinc-300 font-mono border border-white/10">
                          CAM-0{index + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 bg-red-600/80 px-2 py-0.5 rounded text-[9px] font-bold text-white tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> REC
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            feed.status === 'good' || feed.status === 'normal'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {feed.status === 'good' ? '秩序优良' : '课堂活跃'}
                        </span>
                      </div>
                    </div>

                    {/* Hover Center Interactive Actions */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/45 backdrop-blur-[2px] z-20 gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveFocusFeed(feed)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xl transition-transform hover:scale-105 cursor-pointer"
                        >
                          <ZoomIn className="w-4 h-4" /> 深度特写巡视
                        </button>
                        <button
                          onClick={() => handleTakeSnapshot(feed.roomName)}
                          className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer border border-white/20"
                          title="抓拍高清快照"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {classroom && (
                          <button
                            onClick={() => onOpenPatrolDialog(classroom)}
                            className="px-3 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" /> 现场考评填报
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onSelectClassroom(feed.roomId);
                            onClose();
                          }}
                          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          查看物联档案 &gt;
                        </button>
                      </div>
                    </div>

                    {/* Bottom HUD Bar */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between items-end text-[11px] z-10 pointer-events-none">
                      <div className="flex flex-col gap-0.5 text-zinc-300">
                        <div className="flex items-center gap-2 font-medium">
                          <span>授课教师: {feed.teacherName}</span>
                          <span className="text-zinc-500">|</span>
                          <span className="text-emerald-400 font-mono">
                            出勤: {classroom ? `${classroom.presentCount}/${classroom.studentCount}` : '45/45'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                          <span>AI专注度: 96%</span>
                          <span>抬头率: 98%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                        <span className="text-indigo-400">1080P</span>
                        <span>4.2Mbps</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VIEW 2: SINGLE CAMERA DEEP PATROL & EVALUATION CONSOLE */
          <div className="w-full h-full flex gap-4 overflow-hidden">
            {/* Left Main Video Feed (8 cols) */}
            <div className="flex-grow flex flex-col gap-3 min-w-0 h-full">
              <div className="relative flex-grow bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col">
                {/* Main Player Visual */}
                <div className="relative flex-grow w-full h-full overflow-hidden">
                  <img
                    src={
                      activeCameraAngle === 'board'
                        ? selectedClassroomObj?.cameras.board || activeFocusFeed.coverImage
                        : activeCameraAngle === 'students'
                        ? selectedClassroomObj?.cameras.students || activeFocusFeed.coverImage
                        : selectedClassroomObj?.cameras.teacher || activeFocusFeed.coverImage
                    }
                    alt={activeFocusFeed.roomName}
                    className="w-full h-full object-cover transition-transform duration-300"
                    style={{ transform: `scale(${ptzZoom / 100})` }}
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Overlay */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{activeFocusFeed.roomName}</span>
                          <span className="text-indigo-400 text-xs font-normal">
                            ({activeFocusFeed.subject} · {activeFocusFeed.teacherName})
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          机位编码: IPC-0948 · 码流: 主码流 (4K@60FPS H.265)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTakeSnapshot(activeFocusFeed.roomName)}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
                      >
                        <Camera className="w-4 h-4 text-indigo-400" />
                        <span>抓拍当前帧</span>
                      </button>
                      <button
                        onClick={() => setActiveFocusFeed(null)}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer border border-white/15"
                        title="返回网格视图"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* CCTV Watermark HUD */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-25">
                    <Crosshair className="w-24 h-24 text-white stroke-[1]" />
                  </div>

                  {/* Bottom Multi-Angle Camera Switcher */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 text-xs">
                      <button
                        onClick={() => setActiveCameraAngle('teacher')}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          activeCameraAngle === 'teacher'
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" /> 1号位: 教师全景特写
                      </button>
                      <button
                        onClick={() => setActiveCameraAngle('students')}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          activeCameraAngle === 'students'
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" /> 2号位: 学生全貌广角
                      </button>
                      <button
                        onClick={() => setActiveCameraAngle('board')}
                        className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          activeCameraAngle === 'board'
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" /> 3号位: 智慧黑板课件
                      </button>
                    </div>

                    {/* Digital PTZ Zoom Controls */}
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/15 text-xs">
                      <span className="text-zinc-400">数字变倍:</span>
                      <button
                        onClick={() => setPtzZoom((prev) => Math.max(100, prev - 10))}
                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-300 cursor-pointer"
                        title="缩小"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <span className="font-mono font-bold text-indigo-400 w-10 text-center">
                        {ptzZoom}%
                      </span>
                      <button
                        onClick={() => setPtzZoom((prev) => Math.min(200, prev + 10))}
                        className="p-1 rounded-lg hover:bg-white/10 text-zinc-300 cursor-pointer"
                        title="放大"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Patrol & Evaluation Console (4 cols) */}
            <div className="w-96 bg-[#09090b] rounded-2xl border border-white/10 p-5 flex flex-col gap-4 overflow-y-auto shrink-0 shadow-2xl">
              {/* Header */}
              <div className="pb-3 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="font-bold text-white text-sm">AI 督导巡课分析仪</h3>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">实时演算中</span>
              </div>

              {/* Real-time AI Classroom Metrics */}
              <div className="space-y-3">
                <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">学生抬头专注率</span>
                    <span className="font-bold text-emerald-400 font-mono">96.4%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '96.4%' }} />
                  </div>
                </div>

                <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">师生互动活跃度</span>
                    <span className="font-bold text-indigo-400 font-mono">良好 (12次/节)</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">课堂纪律指数</span>
                    <span className="font-bold text-emerald-400 font-mono">99.2分</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99%' }} />
                  </div>
                </div>
              </div>

              {/* Classroom Environment & Power Live Status */}
              {selectedClassroomObj && (
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.06] flex flex-col gap-2">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>教室环境与实时功率</span>
                    <span className="text-[10px] text-zinc-400 font-mono">IOT Sensor</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/[0.04] p-2 rounded-lg">
                      <div className="text-[10px] text-zinc-400">室内温度</div>
                      <div className="font-bold text-white font-mono">{selectedClassroomObj.temperature}°C</div>
                    </div>
                    <div className="bg-white/[0.04] p-2 rounded-lg">
                      <div className="text-[10px] text-zinc-400">实时功率</div>
                      <div className="font-bold text-amber-400 font-mono">{selectedClassroomObj.powerWatts} W</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Patrol Evaluation Form */}
              <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-3">
                <div className="text-xs font-bold text-white">督导现场巡视考评</div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setQuickScore('good')}
                    className={`py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors border ${
                      quickScore === 'good'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 优良
                  </button>
                  <button
                    onClick={() => setQuickScore('normal')}
                    className={`py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors border ${
                      quickScore === 'normal'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    标准
                  </button>
                  <button
                    onClick={() => setQuickScore('warning')}
                    className={`py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors border ${
                      quickScore === 'warning'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                        : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> 需提醒
                  </button>
                </div>

                {selectedClassroomObj && (
                  <button
                    onClick={() => onOpenPatrolDialog(selectedClassroomObj)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" /> 录入详细巡课整改表单
                  </button>
                )}

                <button
                  onClick={() => {
                    if (selectedClassroomObj) {
                      onSelectClassroom(selectedClassroomObj.id);
                      onClose();
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-300 hover:text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
                >
                  进入该教室全维综合物联台
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
