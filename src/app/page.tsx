import { Terminal, Cpu, Package, Github } from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';
import { TerminalDemo } from '../components/TerminalDemo';
import { ProjectShowcase } from '../components/ProjectShowcase';
import { Background3D } from '../components/Background3D';
import { config } from '../config/minux.config';
import { motion } from 'framer-motion';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { ProjectsSection } from '../components/ProjectsSection';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      <Background3D />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />
      
      <HeroSection />
      <FeaturesSection />

      {/* Terminal Demo Section */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-mono font-bold mb-16 text-center">
            Try the Shell
          </h2>
          <TerminalDemo />
        </div>
      </section>

      <ProjectsSection />
    </main>
  );
}
