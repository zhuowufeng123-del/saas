import React, { useState } from 'react';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { PatrolMatrix } from './components/PatrolMatrix';
import { AlarmList } from './components/AlarmList';
import { Classroom3DView } from './components/Classroom3DView';
import { WorkOrderStats } from './components/WorkOrderStats';
import { EnergyCalendar } from './components/EnergyCalendar';
import { RankingList } from './components/RankingList';
import { ClassroomModal } from './components/ClassroomModal';
import { PatrolReportDialog } from './components/PatrolReportDialog';
import { RepairOrderDialog } from './components/RepairOrderDialog';
import { WorkOrdersDrawer } from './components/WorkOrdersDrawer';
import { AlarmsDrawer } from './components/AlarmsDrawer';
import { FullScreenPatrolModal } from './components/FullScreenPatrolModal';
import {
  INITIAL_CLASSROOMS,
  INITIAL_ALARMS,
  INITIAL_PATROL_FEEDS,
} from './mockData';
import { Classroom, InspectionRecord, RepairOrder, AlarmItem } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(INITIAL_CLASSROOMS);
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [patrolFeeds] = useState(INITIAL_PATROL_FEEDS);

  // Modals & Dialogs State
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);
  const [patrolDialogRoom, setPatrolDialogRoom] = useState<Classroom | null>(null);
  const [repairDialogRoom, setRepairDialogRoom] = useState<Classroom | null>(null);
  const [isWorkOrdersOpen, setIsWorkOrdersOpen] = useState(false);
  const [isAlarmsDrawerOpen, setIsAlarmsDrawerOpen] = useState(false);
  const [isFullScreenPatrolOpen, setIsFullScreenPatrolOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const selectedClassroom = classrooms.find((c) => c.id === selectedClassroomId) || null;

  // Handle new inspection submission
  const handleAddInspection = (record: InspectionRecord) => {
    if (!patrolDialogRoom) return;
    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === patrolDialogRoom.id) {
          return {
            ...c,
            inspectionRecords: [record, ...c.inspectionRecords],
          };
        }
        return c;
      })
    );
    showToast(`已成功录入 ${patrolDialogRoom.name} 的巡课督导记录！`);
  };

  // Handle new repair order submission
  const handleAddRepairOrder = (order: RepairOrder) => {
    if (!repairDialogRoom) return;
    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === repairDialogRoom.id) {
          return {
            ...c,
            repairOrders: [order, ...c.repairOrders],
          };
        }
        return c;
      })
    );
    showToast(`已成功创建 ${repairDialogRoom.name} 的设备故障报修工单 ${order.ticketNo}！`);
  };

  // Handle work order status update
  const handleUpdateOrderStatus = (
    classroomId: string,
    orderId: string,
    newStatus: 'pending' | 'processing' | 'completed'
  ) => {
    const statusTextMap = {
      pending: '待派工',
      processing: '处理中',
      completed: '维修已办结',
    };

    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === classroomId) {
          return {
            ...c,
            repairOrders: c.repairOrders.map((o) =>
              o.id === orderId
                ? { ...o, status: newStatus, statusText: statusTextMap[newStatus] }
                : o
            ),
          };
        }
        return c;
      })
    );
    showToast('工单流转状态已同步更新！');
  };

  // Clear or dismiss alarm
  const handleClearAlarm = (alarmId: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== alarmId));
    showToast('告警已被确认并归档');
  };

  // Calculate work order totals
  let totalOrdersCount = 42;
  let pendingOrdersCount = 12;
  let processingOrdersCount = 8;

  let totalSchoolRepairs = 0;
  let completedSchoolRepairs = 0;
  classrooms.forEach((c) => {
    c.repairOrders.forEach((ro) => {
      totalSchoolRepairs++;
      if (ro.status === 'completed') completedSchoolRepairs++;
    });
  });

  const completionRate = Math.round(
    ((22 + completedSchoolRepairs) / (totalOrdersCount + totalSchoolRepairs)) * 100
  );

  return (
    <div className="bg-[#050505] text-[#f3f4f6] min-h-screen w-full flex flex-col overflow-hidden font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Subtle Background Glow Ambient Effects */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 1. Header */}
      <Header
        onRefresh={() => showToast('已成功同步全校物联网与能耗传感器数据')}
        alarmCount={alarms.length}
        onOpenAlarmsDrawer={() => setIsAlarmsDrawerOpen(true)}
      />

      {/* 2. Top Metric KPI Row */}
      <MetricCards
        classroomCount={classrooms.length}
        todayElectricityKwh={845.2}
        electricityDeltaPercent={-5.2}
        alarmCount={alarms.length}
        deviceCount={1245}
        expiringCount={125}
        onOpenAlarms={() => setIsAlarmsDrawerOpen(true)}
        onOpenDevices={() => setIsWorkOrdersOpen(true)}
      />

      {/* 3. Main Cockpit Layout (12 Columns Bento Grid) */}
      <main className="flex-grow px-6 pb-4 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0 h-[calc(100vh-176px)]">
        {/* LEFT COLUMN (3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-3.5 min-h-0 h-full">
          {/* 实时巡课 (Video Matrix) */}
          <PatrolMatrix
            feeds={patrolFeeds}
            classrooms={classrooms}
            onSelectClassroom={(roomId) => setSelectedClassroomId(roomId)}
            onOpenPatrolDialog={(room) => setPatrolDialogRoom(room)}
            onOpenFullScreenPatrol={() => setIsFullScreenPatrolOpen(true)}
          />

          {/* 实时告警 (Alarms) */}
          <AlarmList
            alarms={alarms}
            onSelectClassroom={(roomId) => setSelectedClassroomId(roomId)}
            onClearAlarm={handleClearAlarm}
          />
        </div>

        {/* CENTER COLUMN (6/12) */}
        <div className="lg:col-span-6 flex flex-col gap-3.5 min-h-0 h-full">
          {/* 3D 空间能耗拓扑视图 */}
          <Classroom3DView
            classrooms={classrooms}
            selectedClassroomId={selectedClassroomId}
            onSelectClassroom={(roomId) => setSelectedClassroomId(roomId)}
          />

          {/* 运维统计 */}
          <WorkOrderStats
            totalOrders={totalOrdersCount + totalSchoolRepairs}
            pendingOrders={pendingOrdersCount}
            inProgressOrders={processingOrdersCount}
            completionRate={completionRate}
            onOpenDetails={() => setIsWorkOrdersOpen(true)}
          />
        </div>

        {/* RIGHT COLUMN (3/12) */}
        <div className="lg:col-span-3 flex flex-col gap-3.5 min-h-0 h-full">
          {/* 能耗日历概览 */}
          <EnergyCalendar />

          {/* 教室用电排行 */}
          <RankingList
            onSelectClassroom={(roomId) => setSelectedClassroomId(roomId)}
          />
        </div>
      </main>

      {/* Classroom Detail Modal */}
      {selectedClassroom && (
        <ClassroomModal
          classroom={selectedClassroom}
          onClose={() => setSelectedClassroomId(null)}
          onOpenPatrolDialog={(room) => setPatrolDialogRoom(room)}
          onOpenRepairDialog={(room) => setRepairDialogRoom(room)}
        />
      )}

      {/* On-site Patrol Report Dialog */}
      {patrolDialogRoom && (
        <PatrolReportDialog
          classroom={patrolDialogRoom}
          onClose={() => setPatrolDialogRoom(null)}
          onSubmit={handleAddInspection}
        />
      )}

      {/* Equipment Repair Ticket Dialog */}
      {repairDialogRoom && (
        <RepairOrderDialog
          classroom={repairDialogRoom}
          onClose={() => setRepairDialogRoom(null)}
          onSubmit={handleAddRepairOrder}
        />
      )}

      {/* School-Wide Maintenance Work Orders Drawer */}
      <WorkOrdersDrawer
        isOpen={isWorkOrdersOpen}
        onClose={() => setIsWorkOrdersOpen(false)}
        classrooms={classrooms}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* School-Wide Alarms Drawer */}
      <AlarmsDrawer
        isOpen={isAlarmsDrawerOpen}
        onClose={() => setIsAlarmsDrawerOpen(false)}
        alarms={alarms}
        onSelectClassroom={(roomId) => setSelectedClassroomId(roomId)}
        onClearAlarm={handleClearAlarm}
      />

      {/* Full-Screen Online Patrol Command Center */}
      <FullScreenPatrolModal
        isOpen={isFullScreenPatrolOpen}
        onClose={() => setIsFullScreenPatrolOpen(false)}
        feeds={patrolFeeds}
        classrooms={classrooms}
        onSelectClassroom={(roomId) => setSelectedClassroomId(roomId)}
        onOpenPatrolDialog={(room) => setPatrolDialogRoom(room)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] bg-[#09090b]/95 text-white px-4 py-3 rounded-2xl border border-white/15 shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5 backdrop-blur-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
