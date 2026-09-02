import React, { useState } from 'react';
import { Classroom, RepairOrder } from '../types';
import { X, Wrench } from 'lucide-react';

interface RepairOrderDialogProps {
  classroom: Classroom;
  onClose: () => void;
  onSubmit: (order: RepairOrder) => void;
}

export const RepairOrderDialog: React.FC<RepairOrderDialogProps> = ({
  classroom,
  onClose,
  onSubmit,
}) => {
  const [device, setDevice] = useState('智慧黑板触控模组');
  const [urgency, setUrgency] = useState<'high' | 'medium' | 'low'>('medium');
  const [description, setDescription] = useState('黑板触摸有轻微偏移，影响板书交互。');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: RepairOrder = {
      id: `rep-${Date.now()}`,
      ticketNo: `#rep-${Math.floor(Math.random() * 900 + 100)}`,
      device,
      status: 'pending',
      statusText: '待派工',
      description,
      reportTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      engineer: '待指派驻校工程师',
      urgency,
    };
    onSubmit(newOrder);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#09090b] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400 border border-amber-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide">
                设备故障报修 - {classroom.name}
              </h3>
              <p className="text-xs text-zinc-400">{classroom.roomCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 text-xs">
          {/* Device Selection */}
          <div>
            <label className="block text-zinc-300 mb-1 font-medium">报修设备名称</label>
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="智慧黑板触控模组" className="bg-[#18181b]">智慧黑板触控模组</option>
              <option value="教室变频空调系统" className="bg-[#18181b]">教室变频空调系统</option>
              <option value="护眼照明电路线路" className="bg-[#18181b]">护眼照明电路线路</option>
              <option value="双向流新风风机" className="bg-[#18181b]">双向流新风风机</option>
              <option value="激光高清投影仪" className="bg-[#18181b]">激光高清投影仪</option>
              <option value="网络网关/物联网交换机" className="bg-[#18181b]">网络网关/物联网交换机</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-zinc-300 mb-1.5 font-medium">紧急程度</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('low')}
                className={`py-2 px-3 rounded-xl border font-medium text-center transition-colors cursor-pointer ${
                  urgency === 'low'
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                    : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                普通
              </button>
              <button
                type="button"
                onClick={() => setUrgency('medium')}
                className={`py-2 px-3 rounded-xl border font-medium text-center transition-colors cursor-pointer ${
                  urgency === 'medium'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                中等
              </button>
              <button
                type="button"
                onClick={() => setUrgency('high')}
                className={`py-2 px-3 rounded-xl border font-medium text-center transition-colors cursor-pointer ${
                  urgency === 'high'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                紧急 (加急派工)
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-300 mb-1 font-medium">故障现象与具体描述</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500 resize-none transition-colors"
              placeholder="请输入具体故障现象..."
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors border border-white/10 cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors shadow-md cursor-pointer"
            >
              提交报修工单
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
