'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import { Project } from '../config/minux.config';

interface ProjectShowcaseProps {
  project: Project;
}

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {project.image && (
        <div className="aspect-video w-full overflow-hidden">
          <motion.img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      )}
      
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-mono text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
            {project.description}
          </p>
          
          <div className="flex items-center gap-4">
            <motion.a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group/link"
              whileHover={{ x: 5 }}
            >
              <Github className="w-4 h-4" />
              <span>View Source</span>
              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
            </motion.a>
            
            <motion.a
              href={`https://${project.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group/link"
              whileHover={{ x: 5 }}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Site</span>
              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[141%] h-[141%] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:scale-150 transition-transform duration-500" />
      </div>
    </motion.div>
  );
} 