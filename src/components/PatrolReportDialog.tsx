import React, { useState } from 'react';
import { Classroom, InspectionRecord } from '../types';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Camera } from 'lucide-react';

interface PatrolReportDialogProps {
  classroom: Classroom;
  onClose: () => void;
  onSubmit: (record: InspectionRecord) => void;
}

export const PatrolReportDialog: React.FC<PatrolReportDialogProps> = ({
  classroom,
  onClose,
  onSubmit,
}) => {
  const [level, setLevel] = useState<'normal' | 'warning' | 'critical'>('warning');
  const [inspector, setInspector] = useState('教务处 刘主任');
  const [content, setContent] = useState('课堂纪律良好，部分学生注意力需加强。');
  const [responsiblePerson, setResponsiblePerson] = useState(classroom.headTeacher);
  const [deadline, setDeadline] = useState('2026-09-03 12:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: InspectionRecord = {
      id: `rec-${Date.now()}`,
      level,
      levelText: level === 'normal' ? '巡查正常' : level === 'warning' ? '一般问题' : '严重问题',
      inspector,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      statusText: level === 'normal' ? '巡查正常 / 无问题' : '整改中',
      content,
      responsiblePerson,
      deadline: level === 'normal' ? '无须整改' : deadline,
    };
    onSubmit(newRecord);
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide">
                现场人工巡课填报 - {classroom.name}
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
          {/* Level Selection */}
          <div>
            <label className="block text-zinc-300 mb-1.5 font-medium">巡查评级</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLevel('normal');
                  setContent('教学秩序井然，全班学生出勤率100%，板书与多媒体交互良好。');
                }}
                className={`py-2 px-3 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  level === 'normal'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                    : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                巡查正常
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevel('warning');
                  setContent('后排靠窗学生有耳语走神现象，授课教师未能及时提醒。');
                }}
                className={`py-2 px-3 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  level === 'warning'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                一般问题
              </button>
              <button
                type="button"
                onClick={() => {
                  setLevel('critical');
                  setContent('教师授课迟到或课堂纪律混乱，需重点督导整改。');
                }}
                className={`py-2 px-3 rounded-xl border font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  level === 'critical'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                严重问题
              </button>
            </div>
          </div>

          {/* Inspector & Responsible */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 mb-1 font-medium">巡查人员</label>
              <input
                type="text"
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-300 mb-1 font-medium">责任人 (班主任/任课教师)</label>
              <input
                type="text"
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Issue Content */}
          <div>
            <label className="block text-zinc-300 mb-1 font-medium">巡课情况详述</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white outline-none focus:border-indigo-500 resize-none transition-colors"
              placeholder="请输入巡课记录内容..."
              required
            />
          </div>

          {/* Deadline */}
          {level !== 'normal' && (
            <div>
              <label className="block text-zinc-300 mb-1 font-medium">整改截止期限</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-md cursor-pointer"
            >
              提交巡课记录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
