import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  LayoutDashboard,
  Activity,
  Database,
  Network,
  Shield,
  Terminal,
  MessageSquare,
  Settings
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavItem = ({ icon, label, isActive }: NavItemProps) => (
  <Link
    href="#"
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'text-primary bg-primary/10'
        : 'text-gray-400 hover:text-primary hover:bg-primary/5'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export const Sidebar = () => {
  return (
    <div className="w-64 bg-[#0B1120] border-r border-white/10 p-4 flex flex-col h-screen">
      {/* Logo */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-4"
        >
          <div className="text-primary text-2xl">⬡</div>
          <div className="text-primary font-bold">MINUX OS</div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" isActive />
        <NavItem icon={<Activity size={20} />} label="Diagnostics" />
        <NavItem icon={<Database size={20} />} label="Data Center" />
        <NavItem icon={<Network size={20} />} label="Network" />
        <NavItem icon={<Shield size={20} />} label="Security" />
        <NavItem icon={<Terminal size={20} />} label="Console" />
        <NavItem icon={<MessageSquare size={20} />} label="Communications" />
      </nav>

      {/* System Status */}
      <div className="mt-8 px-4">
        <h3 className="text-xs font-semibold text-gray-400 mb-3">SYSTEM STATUS</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Core Systems</span>
            <div className="flex items-center">
              <div className="h-1 w-16 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full w-[84%] bg-primary rounded-full" />
              </div>
              <span className="text-xs text-primary ml-2">84%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Security</span>
            <div className="flex items-center">
              <div className="h-1 w-16 bg-green-500/20 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-green-500 rounded-full" />
              </div>
              <span className="text-xs text-green-500 ml-2">75%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Network</span>
            <div className="flex items-center">
              <div className="h-1 w-16 bg-blue-500/20 rounded-full overflow-hidden">
                <div className="h-full w-[86%] bg-blue-500 rounded-full" />
              </div>
              <span className="text-xs text-blue-500 ml-2">86%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-auto">
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </div>
    </div>
  );
}; 