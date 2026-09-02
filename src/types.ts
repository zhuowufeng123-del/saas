export type StatusType = 'good' | 'normal' | 'warning' | 'critical';

export interface Classroom {
  id: string;
  name: string;
  building: string;
  buildingCode: string;
  roomCode: string;
  floor: number;
  grade: string;
  classNumber: string;
  status: StatusType;
  statusText: string;
  powerWatts: number;
  todayKwh: number;
  weekKwh: number;
  temperature: number;
  humidity: number;
  co2Ppm?: number;
  pm25?: number;
  headTeacher: string;
  currentSubject: string;
  currentTeacher: string;
  courseTime: string;
  studentCount: number;
  presentCount: number;
  // Position in 3D isometric grid (x, y, z)
  isoPosition: {
    x: number;
    y: number;
    buildingGroup: 'b1' | 'b2' | 'b3';
  };
  cameras: {
    teacher: string;
    students: string;
    board: string;
  };
  devices: {
    blackboard: { status: 'normal' | 'warning' | 'offline'; text: string };
    lighting: { status: 'normal' | 'warning' | 'offline'; text: string; mode?: string };
    ac: { status: 'normal' | 'warning' | 'offline'; text: string; temp?: number; mode?: string };
    freshAir: { status: 'normal' | 'warning' | 'offline'; text: string; speed?: string };
    projector: { status: 'normal' | 'warning' | 'offline'; text: string };
  };
  inspectionRecords: InspectionRecord[];
  repairOrders: RepairOrder[];
}

export interface InspectionRecord {
  id: string;
  level: 'normal' | 'warning' | 'critical';
  levelText: string;
  inspector: string;
  time: string;
  statusText: string; // e.g. "整改中", "已整改", "正常"
  content: string;
  responsiblePerson: string;
  deadline: string;
}

export interface RepairOrder {
  id: string;
  ticketNo: string;
  device: string;
  status: 'pending' | 'processing' | 'completed';
  statusText: string;
  description: string;
  reportTime: string;
  engineer: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface AlarmItem {
  id: string;
  type: 'offline' | 'energy' | 'device' | 'environment';
  typeText: string;
  level: 'critical' | 'warning';
  title: string;
  description: string;
  timeAgo: string;
  roomId: string;
  roomName: string;
  timestamp: string;
  handled?: boolean;
}

export interface PatrolFeed {
  id: string;
  roomId: string;
  roomName: string;
  teacherName: string;
  subject: string;
  status: StatusType;
  coverImage: string;
  isLive: boolean;
}

export interface EnergyHourlyPoint {
  time: string;
  value: number; // kWh
  isPeak?: boolean;
}

export interface EnergyRankItem {
  rank: number;
  roomId: string;
  roomName: string;
  valueKwh: number;
  percentage: number;
  trend: 'up' | 'down' | 'same';
}
