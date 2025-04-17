import { motion } from 'framer-motion';

export const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="w-24 h-24 border-4 border-green-500 rounded-full border-t-transparent"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute text-green-500 text-xl font-bold"
      >
        MINUX
      </motion.div>
    </div>
  );
}; 