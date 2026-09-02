import React, { useState } from 'react';
import { RepairOrder, Classroom } from '../types';
import { X, Wrench, CheckCircle2, PlayCircle } from 'lucide-react';

interface WorkOrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  classrooms: Classroom[];
  onUpdateOrderStatus: (classroomId: string, orderId: string, newStatus: 'pending' | 'processing' | 'completed') => void;
}

export const WorkOrdersDrawer: React.FC<WorkOrdersDrawerProps> = ({
  isOpen,
  onClose,
  classrooms,
  onUpdateOrderStatus,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');

  if (!isOpen) return null;

  // Flatten all repair orders
  const allOrders: Array<RepairOrder & { classroomName: string; classroomId: string }> = [];
  classrooms.forEach((c) => {
    c.repairOrders.forEach((ro) => {
      allOrders.push({ ...ro, classroomName: c.name, classroomId: c.id });
    });
  });

  const filteredOrders = allOrders.filter((ord) => {
    if (filter === 'all') return true;
    return ord.status === filter;
  });

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#09090b] border-l border-white/10 w-full max-w-xl h-full flex flex-col p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">设备运维工单中心</h2>
              <p className="text-xs text-zinc-400">实时跟踪全校报修流转与维保进度</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white/[0.04] rounded-full p-1 my-4 border border-white/[0.08]">
          {(['all', 'pending', 'processing', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-1.5 text-xs rounded-full font-medium transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-indigo-600 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab === 'all'
                ? `全部 (${allOrders.length})`
                : tab === 'pending'
                ? `待派工 (${allOrders.filter((o) => o.status === 'pending').length})`
                : tab === 'processing'
                ? `处理中 (${allOrders.filter((o) => o.status === 'processing').length})`
                : `已办结 (${allOrders.filter((o) => o.status === 'completed').length})`}
            </button>
          ))}
        </div>

        {/* List of Orders */}
        <div className="flex-grow overflow-y-auto flex flex-col gap-3 pr-1">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white/[0.03] border border-white/[0.08] p-4 rounded-2xl flex flex-col gap-2.5 shadow-md hover:border-white/15 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-indigo-400 font-bold">{ord.ticketNo}</span>
                  <span className="text-xs font-bold text-white">{ord.classroomName}</span>
                  <span className="text-xs text-zinc-400">({ord.device})</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
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

              <p className="text-xs text-zinc-300 bg-black/30 p-3 rounded-xl border border-white/[0.06] leading-relaxed">
                {ord.description}
              </p>

              <div className="flex justify-between items-center text-[11px] text-zinc-400 pt-1">
                <span>报修时间: {ord.reportTime}</span>
                <span>负责工程师: {ord.engineer}</span>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.06]">
                {ord.status === 'pending' && (
                  <button
                    onClick={() => onUpdateOrderStatus(ord.classroomId, ord.id, 'processing')}
                    className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    派工并转入处理中
                  </button>
                )}
                {ord.status === 'processing' && (
                  <button
                    onClick={() => onUpdateOrderStatus(ord.classroomId, ord.id, 'completed')}
                    className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    确认已修复并办结
                  </button>
                )}
                {ord.status === 'completed' && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 维保已验收合格
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-zinc-500 text-xs">暂无该状态的运维工单</div>
          )}
        </div>
      </div>
    </div>
  );
};
