export type Screen = 'home' | 'comando' | 'chuva' | 'info';

export type MotorState = 'stopped' | 'opening' | 'closing';

export type RainSensitivity = 'low' | 'medium' | 'high';

export interface ActivityLogEntry {
  id: string;
  message: string;
  timestamp: number;
}

export interface WindowState {
  windowName: string;
  opening: number; // 0-100
  motorState: MotorState;
  lastUpdated: number;
  rainActive: boolean;
  rainAutoCloseEnabled: boolean;
  rainSensitivity: RainSensitivity;
  rainHistory: ActivityLogEntry[];
  activityHistory: ActivityLogEntry[];
  motorRunning: boolean;
  limitSwitchOpen: boolean;
  limitSwitchClosed: boolean;
  rainSensorOk: boolean;
  firmwareVersion: string;
  appVersion: string;
  ssid: string;
}
