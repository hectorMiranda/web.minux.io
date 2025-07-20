'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { 
  Terminal, Github, Globe, Monitor, Bot, LogOut, User, 
  Cpu, Zap, Shield, Cloud, Smartphone, Wifi, 
  ChevronDown, Play, ExternalLink, Star, Users,
  Code, Layers, Box, Brain, Sparkles, Menu
} from 'lucide-react';
import { FirebaseAuthDialog } from '@/components/auth/FirebaseAuthDialog';
import { Background3D } from '@/components/Background3D';
import { MobileMenu } from '@/components/MobileMenu';

const MINUX_REPOS = [
  {
    name: 'web.minux.io',
    description: 'Next-gen web interface with real-time system monitoring',
    url: 'https://github.com/hectorMiranda/web.minux.io',
    icon: Globe,
    tech: 'TypeScript',
    stars: '24',
    status: 'Active'
  },
  {
    name: 'desktop.minux.io',
    description: 'Cross-platform desktop experience with native performance',
    url: 'https://github.com/hectorMiranda/desktop.minux.io',
    icon: Monitor,
    tech: 'Python',
    stars: '18',
    status: 'Beta'
  },
  {
    name: 'robotics.minux.io',
    description: 'MIT-101: Advanced robotics control and automation',
    url: 'https://github.com/hectorMiranda/robotics.minux.io',
    icon: Bot,
    tech: 'C++',
    stars: '31',
    status: 'Research'
  },
  {
    name: 'shell.minux.io',
    description: 'Multi-platform command interface with AI assistance',
    url: 'https://github.com/hectorMiranda/shell.minux.io',
    icon: Terminal,
    tech: 'C++',
    stars: '42',
    status: 'Stable'
  }
];

const FEATURES = [
  {
    icon: Cpu,
    title: 'Bare Metal Performance',
    description: 'Direct hardware access with zero overhead for maximum efficiency',
    color: 'from-cyan-400 to-blue-500'
  },
  {
    icon: Brain,
    title: 'AI-Powered Operations',
    description: 'Intelligent automation and predictive system management',
    color: 'from-purple-400 to-pink-500'
  },
  {
    icon: Shield,
    title: 'Military-Grade Security',
    description: 'Advanced encryption and zero-trust architecture',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: Layers,
    title: 'Modular Architecture',
    description: 'Extensible design with hot-swappable components',
    color: 'from-orange-400 to-red-500'
  },
  {
    icon: Wifi,
    title: 'Edge Computing',
    description: 'Distributed processing across IoT and edge devices',
    color: 'from-teal-400 to-cyan-500'
  },
  {
    icon: Code,
    title: 'Developer-First',
    description: 'Rich APIs, comprehensive docs, and powerful debugging tools',
    color: 'from-indigo-400 to-purple-500'
  }
];

const STATS = [
  { label: 'Active Projects', value: '4+', icon: Box },
  { label: 'Contributors', value: '12+', icon: Users },
  { label: 'GitHub Stars', value: '115+', icon: Star },
  { label: 'Deployments', value: '1.2k+', icon: Cloud }
];

export default function LandingPage() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Force scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.overflowY = 'auto';
    document.body.style.touchAction = 'pan-y';
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-x-hidden relative">
      {/* 3D Background */}
      <Suspense fallback={
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -10,
            pointerEvents: 'none',
            touchAction: 'none'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
            <div className="absolute inset-0 opacity-30">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: Math.random() * 4 + 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    pointerEvents: 'none',
                    touchAction: 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      }>
        <Background3D />
      </Suspense>

      {/* Main Content - Scrollable */}
      <div 
        className="page-content relative z-10" 
        style={{ 
          pointerEvents: 'auto', 
          touchAction: 'auto',
          position: 'relative',
          minHeight: '100vh',
          width: '100%'
        }}
      >

      {/* Navigation */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-950/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10' 
            : 'bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/25"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(34, 211, 238, 0.4)",
                      "0 0 40px rgba(34, 211, 238, 0.6)",
                      "0 0 20px rgba(34, 211, 238, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Terminal className="w-5 h-5 text-white" />
                </motion.div>
              </div>
              <div>
                <span className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  MINUX
                </span>
                <div className="text-xs text-cyan-400/70 font-medium">v2.0</div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">Features</a>
                <a href="#ecosystem" className="text-slate-300 hover:text-white transition-colors font-medium">Ecosystem</a>
                <a href="#stats" className="text-slate-300 hover:text-white transition-colors font-medium">Stats</a>
              </nav>
              
              <motion.a
                href="https://github.com/hectorMiranda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
                whileHover={{ x: 5 }}
              >
                <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden lg:block">GitHub</span>
              </motion.a>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg border border-cyan-400/20">
                    <User className="w-4 h-4" />
                    <span className="max-w-32 truncate">{user?.email}</span>
                  </div>
                  <motion.button
                    onClick={() => {
                      signOut();
                    }}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:block">Sign Out</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setShowAuthDialog(true)}
                  className="relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 211, 238, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMobileMenu(true)}
            >
              <Menu className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-100">Next-Generation System Management</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl sm:text-6xl lg:text-8xl font-mono font-bold leading-tight"
              >
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Do More
                </span>
                <span className="block text-white">With Less</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
              >
                Revolutionary system management platform combining{' '}
                <span className="text-cyan-400 font-semibold">AI-powered automation</span>,{' '}
                <span className="text-blue-400 font-semibold">bare-metal performance</span>, and{' '}
                <span className="text-purple-400 font-semibold">edge computing</span> capabilities.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <motion.button
                onClick={() => setShowAuthDialog(true)}
                className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl shadow-cyan-500/25 min-w-48"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 40px rgba(34, 211, 238, 0.5)" 
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Get Started
                </span>
              </motion.button>
              
              <motion.a
                href="https://github.com/hectorMiranda"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg transition-all min-w-48"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  View Source
                </span>
              </motion.a>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2 text-slate-400"
              >
                <span className="text-sm font-medium">Explore</span>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="text-center group"
                >
                  <div className="relative mx-auto w-16 h-16 mb-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20 flex items-center justify-center backdrop-blur-sm">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-mono font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Core Features
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Cutting-edge capabilities designed for the future of system management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group relative"
                >
                  <div className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                    
                    <div className="relative">
                      <div className="mb-6">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-slate-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-6xl font-mono font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Ecosystem
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              A comprehensive suite of interconnected tools and platforms
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {MINUX_REPOS.map((repo, index) => {
              const Icon = repo.icon;
              return (
                <motion.a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      repo.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      repo.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      repo.status === 'Research' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {repo.status}
                    </span>
                  </div>

                  <div className="relative">
                    {/* Icon */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center backdrop-blur-sm">
                        <Icon className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{repo.stars}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-2xl font-mono font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                        {repo.name}
                      </h3>
                      <p className="text-slate-300 mb-4 leading-relaxed">
                        {repo.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 text-sm font-medium bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600/50">
                          {repo.tech}
                        </span>
                        <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <motion.div 
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    MINUX
                  </span>
                  <div className="text-sm text-cyan-400/70 font-medium">Next-Gen System Management</div>
                </div>
              </motion.div>
              <motion.p 
                className="text-slate-300 leading-relaxed mb-6 max-w-md"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Revolutionary platform combining AI-powered automation, bare-metal performance, 
                and edge computing for the future of system management.
              </motion.p>
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <a
                  href="https://github.com/hectorMiranda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors group"
                >
                  <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://twitter.com/hector_miranda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors group"
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </motion.div>
            </div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#ecosystem" className="text-slate-400 hover:text-white transition-colors">Ecosystem</a></li>
                <li><a href="https://github.com/hectorMiranda/web.minux.io#readme" className="text-slate-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="https://github.com/hectorMiranda" className="text-slate-400 hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="https://github.com/hectorMiranda/web.minux.io" className="text-slate-400 hover:text-white transition-colors">Web Platform</a></li>
                <li><a href="https://github.com/hectorMiranda/desktop.minux.io" className="text-slate-400 hover:text-white transition-colors">Desktop App</a></li>
                <li><a href="https://github.com/hectorMiranda/shell.minux.io" className="text-slate-400 hover:text-white transition-colors">Shell Client</a></li>
                <li><a href="https://github.com/hectorMiranda/robotics.minux.io" className="text-slate-400 hover:text-white transition-colors">Robotics</a></li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div 
            className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Minux. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onShowAuth={() => setShowAuthDialog(true)}
      />

      {/* Auth Dialog */}
      <AnimatePresence>
        {showAuthDialog && (
          <FirebaseAuthDialog 
            onClose={() => setShowAuthDialog(false)}
          />
        )}
      </AnimatePresence>
      
      </div> {/* End page-content */}
    </div>
  );
} 