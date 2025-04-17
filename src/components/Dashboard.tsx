import { motion } from 'framer-motion';
import { config } from '../config/minux.config';

export const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-900 text-white p-8"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-green-500">{config.siteTitle}</h1>
          <p className="text-gray-400 mt-2">{config.subtitle}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-colors"
            >
              <h3 className="text-xl font-semibold text-green-500">{project.title}</h3>
              <p className="text-gray-400 mt-2">{project.description}</p>
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-400 mt-4 inline-block"
              >
                View Repository →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}; 