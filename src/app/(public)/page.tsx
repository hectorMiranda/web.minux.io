'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { FeaturesSection } from '@/components/FeaturesSection';
import { Terminal, Github, Globe, Monitor, Bot, LogOut, User } from 'lucide-react';
import { FirebaseAuthDialog } from '@/components/auth/FirebaseAuthDialog';

const MINUX_REPOS = [
  {
    name: 'web.minux.io',
    description: 'Web interface for Minux system management',
    url: 'https://github.com/hectorMiranda/web.minux.io',
    icon: Globe,
    tech: 'TypeScript'
  },
  {
    name: 'desktop.minux.io',
    description: 'Desktop experience for minux.io',
    url: 'https://github.com/hectorMiranda/desktop.minux.io',
    icon: Monitor,
    tech: 'Python'
  },
  {
    name: 'robotics.minux.io',
    description: 'MIT-101: robotux, a PCC project',
    url: 'https://github.com/hectorMiranda/robotics.minux.io',
    icon: Bot,
    tech: 'C++'
  },
  {
    name: 'shell.minux.io',
    description: 'Multi platform client for minux.io',
    url: 'https://github.com/hectorMiranda/shell.minux.io',
    icon: Terminal,
    tech: 'C++'
  }
];

export default function LandingPage() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/console');
    }
  }, [isAuthenticated, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1120]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-primary/20 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-mono font-bold">MINUX</span>
            </div>
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com/hectorMiranda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                whileHover={{ x: 5 }}
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </motion.a>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <User className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthDialog(true)}
                  className="px-4 py-2 rounded-lg bg-primary/20 text-primary border border-primary/20 hover:bg-primary/30 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-mono font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#00FFFF] to-primary"
            >
              Do More With Less
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/70 mb-8 max-w-3xl mx-auto"
            >
              A next-generation system management platform with built-in MIDI controls, robotics integration, and advanced monitoring capabilities.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4"
            >
              <button
                onClick={() => setShowAuthDialog(true)}
                className="px-8 py-3 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </button>
              <a
                href="https://github.com/hectorMiranda"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                View on GitHub
              </a>
            </motion.div>
          </div>

          {/* Ecosystem Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
          >
            {MINUX_REPOS.map((repo, index) => {
              const Icon = repo.icon;
              return (
                <motion.a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-6 rounded-lg border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden hover:border-primary/50 transition-colors"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.2 + (index * 0.1) }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-mono font-bold text-white group-hover:text-primary transition-colors">
                        {repo.name}
                      </h3>
                      <p className="text-sm text-white/50">
                        {repo.description} · <span className="text-primary/70">{repo.tech}</span>
                      </p>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-primary/20 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-mono font-bold">MINUX</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="https://github.com/hectorMiranda/web.minux.io#readme" className="text-white/70 hover:text-white transition-colors">Documentation</a>
              <a href="https://github.com/hectorMiranda" className="text-white/70 hover:text-white transition-colors">Projects</a>
              <a href="https://github.com/hectorMiranda" className="text-white/70 hover:text-white transition-colors">GitHub</a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/hectorMiranda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/hector_miranda"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-white/50 text-sm">
            © {new Date().getFullYear()} Minux. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Auth Dialog */}
      {showAuthDialog && (
        <FirebaseAuthDialog 
          onClose={() => setShowAuthDialog(false)}
        />
      )}
    </div>
  );
} 