export interface HealthData {
  id: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  ph: number;
  infectionLevel: 'low' | 'medium' | 'high' | 'critical';
  pestDetected: boolean;
  pesticideLevel: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  farmLocation: string;
  cropType: string;
  phoneNumber: string;
  avatar?: string;
}

export interface PesticideSchedule {
  id: string;
  cropType: string;
  pesticideName: string;
  lastApplied: Date;
  nextDue: Date;
  dosage: string;
  status: 'pending' | 'applied' | 'overdue';
}

export interface RemoteAccessSettings {
  enableRemoteMonitoring: boolean;
  alertThresholds: {
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    soilMoisture: { min: number; max: number };
    infectionLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  notificationMethods: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}
