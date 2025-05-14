
export interface Patient {
  id: string;
  name: string;
  age: number;
  roomNumber: string;
  admissionDate: Date;
  metrics: HealthMetrics;
}

export interface HealthMetrics {
  heartRate: VitalSign;
  bodyTemperature: VitalSign;
  oxygenSaturation: VitalSign;
}

export interface VitalSign {
  value: number;
  unit: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'alert';
  history: Array<{value: number, timestamp: Date, status: 'normal' | 'warning' | 'alert'}>;
}

export interface HealthAlert {
  id: string;
  patientId: string;
  patientName: string;
  metric: keyof HealthMetrics;
  value: number;
  threshold: {
    min: number;
    max: number;
  };
  timestamp: Date;
  status: 'new' | 'acknowledged' | 'resolved';
}

export const vitalRanges = {
  heartRate: {
    normal: { min: 60, max: 100 },
    warning: { min: 50, max: 120 },
    // Beyond warning is alert
  },
  bodyTemperature: {
    normal: { min: 36.1, max: 37.5 },
    warning: { min: 35, max: 38.5 },
    // Beyond warning is alert
  },
  oxygenSaturation: {
    normal: { min: 95, max: 100 },
    warning: { min: 90, max: 100 },
    // Below warning min is alert
  }
};
