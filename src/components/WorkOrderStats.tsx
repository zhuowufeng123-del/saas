import React from 'react';
import { Wrench, ChevronRight, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface WorkOrderStatsProps {
  totalOrders?: number;
  pendingOrders?: number;
  inProgressOrders?: number;
  completionRate?: number;
  onOpenDetails?: () => void;
}

export const WorkOrderStats: React.FC<WorkOrderStatsProps> = ({
  totalOrders = 42,
  pendingOrders = 12,
  inProgressOrders = 8,
  completionRate = 52,
  onOpenDetails,
}) => {
  return (
    <div className="bento-card rounded-2xl h-[92px] flex flex-col shrink-0 min-h-0 border border-white/[0.08] overflow-hidden">
      {/* Header */}
      <div className="p-2 px-3.5 card-header-border flex justify-between items-center bg-[#09090b]/60 backdrop-blur-md shrink-0">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-indigo-400" />
          运维工单统计
        </h2>
        <button
          onClick={onOpenDetails}
          className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer font-medium transition-colors"
        >
          查看工单详情
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 4 Stats Columns */}
      <div className="px-4 py-2 flex items-center justify-around flex-grow min-h-0 bg-black/20">
        {/* Total */}
        <div
          onClick={onOpenDetails}
          className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform"
        >
          <span className="text-[10px] text-zinc-400 group-hover:text-indigo-400 font-medium">总工单</span>
          <span className="text-xl font-extrabold text-white font-mono leading-none mt-1">
            {totalOrders}
          </span>
        </div>

        <div className="h-6 w-px bg-white/[0.08]" />

        {/* Pending */}
        <div
          onClick={onOpenDetails}
          className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform"
        >
          <span className="text-[10px] text-amber-400/90 flex items-center gap-1 font-medium">
            <Clock className="w-2.5 h-2.5 text-amber-400" />
            待处理
          </span>
          <span className="text-xl font-extrabold text-amber-400 font-mono leading-none mt-1">
            {pendingOrders}
          </span>
        </div>

        <div className="h-6 w-px bg-white/[0.08]" />

        {/* Processing */}
        <div
          onClick={onOpenDetails}
          className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform"
        >
          <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-medium">
            <PlayCircle className="w-2.5 h-2.5 text-indigo-400" />
            处理中
          </span>
          <span className="text-xl font-extrabold text-indigo-400 font-mono leading-none mt-1">
            {inProgressOrders}
          </span>
        </div>

        <div className="h-6 w-px bg-white/[0.08]" />

        {/* Completion Rate */}
        <div
          onClick={onOpenDetails}
          className="flex flex-col items-center cursor-pointer group hover:scale-105 transition-transform"
        >
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            完成率
          </span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono leading-none mt-1">
            {completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
