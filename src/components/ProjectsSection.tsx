'use client';

import { motion } from 'framer-motion';
import { ProjectShowcase } from './ProjectShowcase';
import { config } from '../config/minux.config';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export function ProjectsSection() {
  return (
    <section id="projects" className="py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-4xl font-mono font-bold mb-16 text-center"
          {...fadeInUp}
        >
          Projects
        </motion.h2>
        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
          initial="initial"
          animate="animate"
        >
          {config.projects.map((project) => (
            <motion.div key={project.title} {...fadeInUp}>
              <ProjectShowcase project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 