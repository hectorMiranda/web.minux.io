export interface DebugMessage {
  timestamp: Date;
  type: 'info' | 'error' | 'midi';
  message: string;
} 