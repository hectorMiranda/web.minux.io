import {
  Terminal,
  Home,
  Cpu,
  Thermometer,
  Network,
  Wifi,
  HardDrive,
  Gauge,
  Settings,
  Power,
  Lock,
  Blocks,
  Music,
  Box,
  FileText,
  FileJson,
  // Add any new icons here
} from 'lucide-react';

export const iconMap = {
  Terminal,
  Home,
  Cpu,
  Thermometer,
  Network,
  Wifi,
  HardDrive,
  Gauge,
  Settings,
  Power,
  Lock,
  Blocks,
  Music,
  Box,
  FileText,
  FileJson,
  // Add mappings for new icons here
} as const;

export type IconName = keyof typeof iconMap; 