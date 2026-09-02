import React, { useState } from 'react';
import { Classroom, InspectionRecord, RepairOrder } from '../types';
import {
  X,
  Camera,
  Wrench,
  Thermometer,
  Droplets,
  Zap,
  Wind,
  Lightbulb,
  PlusCircle,
  TrendingUp,
  Activity,
  Cpu,
} from 'lucide-react';

interface ClassroomModalProps {
  classroom: Classroom | null;
  onClose: () => void;
  onOpenPatrolDialog: (classroom: Classroom) => void;
  onOpenRepairDialog: (classroom: Classroom) => void;
}

export const ClassroomModal: React.FC<ClassroomModalProps> = ({
  classroom,
  onClose,
  onOpenPatrolDialog,
  onOpenRepairDialog,
}) => {
  const [activeTab, setActiveTab] = useState<'realtime' | 'patrol' | 'repair' | 'energy'>('realtime');
  const [deviceSwitches, setDeviceSwitches] = useState<Record<string, boolean>>({
    lighting: true,
    ac: true,
  });

  if (!classroom) return null;

  const toggleDevice = (dev: string) => {
    setDeviceSwitches((prev) => ({ ...prev, [dev]: !prev[dev] }));
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bento-card p-0 rounded-2xl w-full max-w-6xl h-[92vh] max-h-[900px] flex flex-col border border-white/15 shadow-2xl bg-[#09090b] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex flex-wrap justify-between items-center border-b border-white/[0.08] bg-black/40 backdrop-blur-md shrink-0 gap-4">
          <div className="flex items-center gap-4">
            {/* Grade Badge */}
            <div className="w-13 h-13 bg-white/[0.04] rounded-xl border border-white/10 flex items-center justify-center text-zinc-200 font-bold flex-col leading-tight shadow-md p-1">
              <span className="text-sm font-semibold">{classroom.classNumber}</span>
              <span className="text-[10px] text-indigo-400">{classroom.grade}</span>
            </div>

            {/* Titles & Meta */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl md:text-2xl text-white font-bold tracking-wide">
                  {classroom.name} 详情档案
                </h2>
                <span className="bg-white/[0.06] px-2.5 py-0.5 rounded-full text-xs text-zinc-300 border border-white/10 font-mono">
                  {classroom.roomCode}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                    classroom.status === 'good' || classroom.status === 'normal'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : classroom.status === 'warning'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {classroom.statusText}
                </span>
              </div>

              <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-2 mt-1">
                <span>班主任: {classroom.headTeacher}</span>
                <span className="text-zinc-600">·</span>
                <span>当前授课: {classroom.currentSubject} ({classroom.currentTeacher})</span>
                <span className="text-zinc-600">·</span>
                <span>考勤: {classroom.presentCount}/{classroom.studentCount}人</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenPatrolDialog(classroom)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Camera className="w-4 h-4" />
              现场人工巡课填报
            </button>
            <button
              onClick={() => onOpenRepairDialog(classroom)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              设备故障报修
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 flex border-b border-white/[0.08] shrink-0 gap-6 bg-black/20">
          <button
            onClick={() => setActiveTab('realtime')}
            className={`px-2 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'realtime'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-zinc-400 hover:text-white border-transparent'
            }`}
          >
            综合实时档案
          </button>
          <button
            onClick={() => setActiveTab('patrol')}
            className={`px-2 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'patrol'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-zinc-400 hover:text-white border-transparent'
            }`}
          >
            历史巡课记录 ({classroom.inspectionRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('repair')}
            className={`px-2 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'repair'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-zinc-400 hover:text-white border-transparent'
            }`}
          >
            设备运维报修 ({classroom.repairOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-2 py-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
              activeTab === 'energy'
                ? 'text-indigo-400 border-indigo-400'
                : 'text-zinc-400 hover:text-white border-transparent'
            }`}
          >
            用电曲线与能耗分析
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-grow relative overflow-y-auto p-6 bg-[#050505]/60">
          {/* TAB 1: 综合实时档案 */}
          {activeTab === 'realtime' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Video Matrix (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* 2 Top Cameras (Teacher & Student Panorama) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Teacher Cam */}
                  <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10 relative shadow-lg aspect-video group">
                    <img
                      src={classroom.cameras.teacher}
                      alt="教师全景"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-xs text-white font-medium flex items-center gap-1.5 border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      教师全景 (1080P)
                    </div>
                  </div>

                  {/* Student Cam */}
                  <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10 relative shadow-lg aspect-video group">
                    <img
                      src={classroom.cameras.students}
                      alt="学生全景"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-xs text-white font-medium flex items-center gap-1.5 border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      学生全景 (1080P)
                    </div>
                  </div>
                </div>

                {/* Courseware Screen */}
                <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10 relative shadow-lg group flex-grow min-h-[200px]">
                  <img
                    src={classroom.cameras.board}
                    alt="课件画面"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity max-h-[300px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white font-medium flex items-center gap-1.5 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    课件推流广播
                  </div>
                </div>
              </div>

              {/* Right Telemetry & Controls (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Environmental & Power Parameters */}
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.08] flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    环境与用电监测
                  </h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="bg-white/[0.03] p-3 rounded-xl flex flex-col items-center border border-white/[0.06]">
                      <Thermometer className="w-5 h-5 text-indigo-400" />
                      <span className="font-bold text-lg text-white font-mono mt-1">
                        {classroom.temperature}°C
                      </span>
                      <span className="text-[10px] text-zinc-400">室内温度</span>
                    </div>

                    <div className="bg-white/[0.03] p-3 rounded-xl flex flex-col items-center border border-white/[0.06]">
                      <Droplets className="w-5 h-5 text-sky-400" />
                      <span className="font-bold text-lg text-white font-mono mt-1">
                        {classroom.humidity}%
                      </span>
                      <span className="text-[10px] text-zinc-400">室内湿度</span>
                    </div>

                    <div className="bg-white/[0.03] p-3 rounded-xl flex flex-col items-center border border-white/[0.06]">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-lg text-amber-400 font-mono mt-1">
                        {classroom.powerWatts} W
                      </span>
                      <span className="text-[10px] text-zinc-400">实时功率</span>
                    </div>
                  </div>
                </div>

                {/* Device Status & Controls (Lighting & AC only) */}
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.08] flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    物联设备状态与远程联动
                  </h3>

                  <div className="flex flex-col gap-2.5">
                    {/* Lighting */}
                    <div className="flex justify-between items-center bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Lightbulb className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs text-white font-medium">智能照明系统</div>
                          <div className="text-[10px] text-zinc-400">{classroom.devices.lighting.mode}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleDevice('lighting')}
                        className={`text-[11px] px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                          deviceSwitches.lighting
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-white/10 text-zinc-400'
                        }`}
                      >
                        {deviceSwitches.lighting ? '运行中' : '已关闭'}
                      </button>
                    </div>

                    {/* AC */}
                    <div className="flex justify-between items-center bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                          <Wind className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <div className="text-xs text-white font-medium">变频温控空调</div>
                          <div className="text-[10px] text-amber-400">{classroom.devices.ac.status}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleDevice('ac')}
                        className={`text-[11px] px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                          deviceSwitches.ac
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-white/10 text-zinc-400'
                        }`}
                      >
                        {deviceSwitches.ac ? '开启运行' : '已关机'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 历史巡课记录 */}
          {activeTab === 'patrol' && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base text-white font-bold">
                  该教室历史人工巡课与督导台账
                </h3>
                <button
                  onClick={() => onOpenPatrolDialog(classroom)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  添加巡课记录
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {classroom.inspectionRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.08] flex flex-col gap-3 shadow-md"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            rec.level === 'warning'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : rec.level === 'critical'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {rec.levelText}
                        </span>
                        <span className="text-xs text-zinc-300">巡查人: {rec.inspector}</span>
                        <span className="text-xs text-zinc-500 font-mono">{rec.time}</span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-400">
                        整改状态: {rec.statusText}
                      </div>
                    </div>

                    <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.06] text-sm text-zinc-200 leading-relaxed">
                      {rec.content}
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-400 pt-1">
                      <span>责任人: {rec.responsiblePerson}</span>
                      <span>整改期限: {rec.deadline}</span>
                    </div>
                  </div>
                ))}

                {classroom.inspectionRecords.length === 0 && (
                  <div className="p-12 text-center text-zinc-500 text-sm">
                    暂无不良巡课问题记录，教学秩序良好。
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 设备运维报修 */}
          {activeTab === 'repair' && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base text-white font-bold">
                  该教室设备故障报修工单
                </h3>
                <button
                  onClick={() => onOpenRepairDialog(classroom)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  添加报修工单
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {classroom.repairOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.08] flex flex-col gap-3 shadow-md"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="text-white font-bold text-sm flex items-center gap-2">
                        <span className="text-indigo-400 font-mono">{ord.ticketNo}</span>
                        <span>{ord.device}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          ord.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : ord.status === 'processing'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {ord.statusText}
                      </span>
                    </div>

                    <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.06] text-sm text-zinc-200 leading-relaxed">
                      {ord.description}
                    </div>

                    <div className="flex justify-between items-center text-xs text-zinc-400 pt-1">
                      <span>报修时间: {ord.reportTime}</span>
                      <span>维修工程师: {ord.engineer}</span>
                    </div>
                  </div>
                ))}

                {classroom.repairOrders.length === 0 && (
                  <div className="p-12 text-center text-zinc-500 text-sm">
                    暂无历史报修工单，设备运转良好。
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: 用电曲线与能耗分析 */}
          {activeTab === 'energy' && (
            <div className="flex flex-col gap-6">
              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.08] flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">当前实时功率</span>
                  <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">
                    {classroom.powerWatts} W
                  </div>
                  <span className="text-[10px] text-zinc-500">包含照明、空调及多媒体</span>
                </div>

                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.08] flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">今日累计耗电</span>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                    {classroom.todayKwh} kWh
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">较昨日同期节能 4.2%</span>
                </div>

                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.08] flex flex-col gap-1">
                  <span className="text-xs text-zinc-400">本周累计耗电</span>
                  <div className="text-3xl font-extrabold text-indigo-400 font-mono mt-1">
                    {classroom.weekKwh} kWh
                  </div>
                  <span className="text-[10px] text-zinc-500">年累计节省碳排放 82kg</span>
                </div>
              </div>

              {/* 7-day Power Consumption Trend Line */}
              <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/[0.08] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm text-white font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    近 7 天用电走势详细分析
                  </h4>
                  <span className="text-xs text-zinc-400 font-mono">单位: kWh/天</span>
                </div>

                <div className="h-[260px] w-full relative">
                  <svg
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                    viewBox="0 0 1000 300"
                  >
                    {/* Grid lines */}
                    <line x1="0" x2="1000" y1="50" y2="50" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4,4" />
                    <line x1="0" x2="1000" y1="150" y2="150" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4,4" />
                    <line x1="0" x2="1000" y1="250" y2="250" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="4,4" />

                    {/* Y-axis labels */}
                    <text x="5" y="55" fill="rgba(161, 161, 170, 0.8)" fontSize="12" fontFamily="monospace">12 kWh</text>
                    <text x="5" y="155" fill="rgba(161, 161, 170, 0.8)" fontSize="12" fontFamily="monospace">6 kWh</text>
                    <text x="5" y="255" fill="rgba(161, 161, 170, 0.8)" fontSize="12" fontFamily="monospace">0 kWh</text>

                    {/* Line path matching the template */}
                    <path
                      d="M 60 120 Q 200 90, 350 85 T 650 90 T 800 240 T 950 250"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />

                    {/* Points */}
                    <circle cx="60" cy="120" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    <circle cx="200" cy="85" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    <circle cx="350" cy="90" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    <circle cx="500" cy="85" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    <circle cx="650" cy="90" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    <circle cx="800" cy="240" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                    <circle cx="950" cy="250" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />

                    {/* X-axis labels */}
                    <text x="50" y="285" fill="rgba(161, 161, 170, 0.8)" fontSize="13">周一</text>
                    <text x="190" y="285" fill="rgba(161, 161, 170, 0.8)" fontSize="13">周二</text>
                    <text x="340" y="285" fill="rgba(161, 161, 170, 0.8)" fontSize="13">周三</text>
                    <text x="490" y="285" fill="rgba(161, 161, 170, 0.8)" fontSize="13">周四</text>
                    <text x="640" y="285" fill="rgba(161, 161, 170, 0.8)" fontSize="13">周五</text>
                    <text x="790" y="285" fill="rgba(161, 161, 170, 0.8)" fontSize="13">周六</text>
                    <text x="940" y="285" fill="rgba(161, 161, 170, 0.8)" fontSize="13">周日</text>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
