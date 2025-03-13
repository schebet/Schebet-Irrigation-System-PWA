export interface Zone {
  id: string;
  name: string;
  active: boolean;
  schedule: Schedule[];
}

export interface Schedule {
  id: string;
  zoneId: string;
  startTime: string;
  duration: number; // in minutes
  days: number[]; // 0-6 for Sunday-Saturday
  active: boolean;
}

export interface WateringSession {
  id: string;
  zoneId: string;
  startTime: Date;
  endTime: Date;
  waterUsage: number; // in liters
  automatic: boolean;
}