import React, { useState } from 'react';
import { PatrolFeed, Classroom } from '../types';
import { Video, ZoomIn, Radio, Maximize2 } from 'lucide-react';

interface PatrolMatrixProps {
  feeds: PatrolFeed[];
  classrooms?: Classroom[];
  onSelectClassroom: (roomId: string) => void;
  onOpenPatrolDialog?: (classroom: Classroom) => void;
  onOpenFullScreenPatrol?: () => void;
}

export const PatrolMatrix: React.FC<PatrolMatrixProps> = ({
  feeds,
  onSelectClassroom,
  onOpenFullScreenPatrol,
}) => {
  const [previewVideo, setPreviewVideo] = useState<PatrolFeed | null>(null);

  return (
    <div className="bento-card rounded-2xl flex-grow flex flex-col min-h-0 relative overflow-hidden border border-white/[0.08]">
      {/* Header */}
      <div className="p-3.5 card-header-border flex justify-between items-center bg-[#09090b]/60 backdrop-blur-md shrink-0">
        <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Video className="w-3.5 h-3.5 text-indigo-400" />
          实时巡课
          <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 ml-1">
            <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
          </span>
        </h2>

        {/* Fullscreen Button */}
        <button
          onClick={onOpenFullScreenPatrol}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-indigo-600 hover:text-white text-zinc-300 border border-white/[0.08] hover:border-indigo-500/50 text-[11px] font-medium transition-all cursor-pointer group shadow-sm"
          title="全屏展示巡课画面用于在线巡课"
        >
          <Maximize2 className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white transition-colors" />
          <span className="group-hover:text-white">全屏巡课</span>
        </button>
      </div>

      {/* 2x2 Video Matrix Grid */}
      <div className="p-2.5 flex-grow grid grid-cols-2 gap-2.5 overflow-y-auto bg-black/20 content-start">
        {feeds.slice(0, 4).map((feed) => (
          <div
            key={feed.id}
            onClick={() => onSelectClassroom(feed.roomId)}
            className="relative bg-zinc-900 rounded-xl overflow-hidden aspect-video border border-white/10 group cursor-pointer transition-all hover:border-indigo-400/80 hover:shadow-[0_0_16px_rgba(99,102,241,0.3)]"
          >
            <img
              src={feed.coverImage}
              alt={`${feed.roomName} 监控画面`}
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

            {/* Room Name & Subject */}
            <div className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white border border-white/15 z-10 flex items-center gap-1 font-medium">
              <span>{feed.roomName}</span>
              <span className="text-indigo-400 text-[9px]">({feed.subject})</span>
            </div>

            {/* Status dot */}
            <div
              className={`absolute top-2 right-2 w-2 h-2 rounded-full z-10 ${
                feed.status === 'good' || feed.status === 'normal'
                  ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                  : 'bg-amber-400 shadow-[0_0_6px_#f59e0b]'
              }`}
            />

            {/* Hover overlay & quick action */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px] z-20">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-600 text-white rounded-full hover:scale-110 transition-transform shadow-lg">
                  <ZoomIn className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-[10px] text-white font-semibold mt-1.5 drop-shadow">
                点击进入教室档案
              </span>
            </div>

            {/* Bottom Teacher Info */}
            <div className="absolute bottom-1.5 left-2 right-2 flex justify-between items-center text-[9px] text-zinc-300 z-10">
              <span>教师: {feed.teacherName}</span>
              <span className="font-mono text-indigo-400 font-semibold">1080P</span>
            </div>
          </div>
        ))}
      </div>

      {/* Video Preview Lightbox if opened */}
      {previewVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="bg-[#09090b] border border-white/15 rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center bg-white/[0.03] border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="font-bold text-white text-base">
                  {previewVideo.roomName} - 实时高清巡课画面
                </h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 text-xs cursor-pointer"
              >
                关闭
              </button>
            </div>
            <div className="relative aspect-video">
              <img
                src={previewVideo.coverImage}
                alt={previewVideo.roomName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs text-white border border-white/10">
                授课教师: {previewVideo.teacherName} | 学科: {previewVideo.subject} | 实时码率: 4.2Mbps
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
