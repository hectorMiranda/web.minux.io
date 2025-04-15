'use client';

import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export function FeaturesSection() {
  return (
    <section className="py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl font-mono font-bold mb-16 text-center"
          {...fadeInUp}
        >
          Core Features
        </motion.h2>
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
          initial="initial"
          animate="animate"
        >
          <motion.div {...fadeInUp}>
            <FeatureCard
              title="Custom Shell"
              description="Built-in commands for crypto and robotics operations"
              iconName="terminal"
              color="#00FF88"
            />
          </motion.div>
          <motion.div {...fadeInUp}>
            <FeatureCard
              title="Baremetal Support"
              description="Run directly on microcontrollers and embedded systems"
              iconName="cpu"
              color="#00FFFF"
            />
          </motion.div>
          <motion.div {...fadeInUp}>
            <FeatureCard
              title="Modular Add-ins"
              description="Extend functionality with GitHub-hosted modules"
              iconName="package"
              color="#FF8800"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 