'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNavigation } from './MobileNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation 
          isOpen={isMobileMenuOpen} 
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <main className="flex-1 overflow-hidden bg-gradient-to-br from-slate-950/90 via-slate-900/50 to-slate-950/90">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}; 