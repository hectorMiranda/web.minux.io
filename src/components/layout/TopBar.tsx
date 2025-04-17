import { Search, Bell, Sun } from 'lucide-react';

export const TopBar = () => {
  return (
    <div className="h-16 border-b border-white/10 bg-[#0B1120] flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search systems..."
            className="w-full bg-black/20 text-gray-300 pl-10 pr-4 py-2 rounded-lg border border-white/10 focus:outline-none focus:border-primary/50 text-sm"
          />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/10 transition-colors">
          <Sun className="w-5 h-5" />
        </button>
        <div className="h-8 w-[1px] bg-white/10" />
        <button className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-sm">M</span>
          </div>
        </button>
      </div>
    </div>
  );
}; 