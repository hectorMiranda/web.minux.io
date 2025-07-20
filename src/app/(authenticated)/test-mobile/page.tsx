'use client';

import { motion } from 'framer-motion';

export default function TestScrollPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50"
      >
        <h1 className="text-2xl font-bold text-cyan-400 mb-4">Mobile Navigation Test</h1>
        <p className="text-slate-300 mb-4">
          This page helps test the mobile navigation scrolling behavior. 
          Open the mobile menu (hamburger button) to test:
        </p>
        
        <ul className="space-y-2 text-slate-400">
          <li>✅ Menu button integrated into top bar</li>
          <li>✅ MINUX.IO branding centered in header</li>
          <li>✅ Scrollable menu items with proper scrollbar</li>
          <li>✅ Touch-friendly interactions</li>
          <li>✅ Palm Pilot/BlackBerry aesthetic</li>
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50"
      >
        <h2 className="text-xl font-bold text-lime-400 mb-4">Scrolling Instructions</h2>
        <p className="text-slate-300 mb-2">
          The mobile menu should now properly scroll. To test:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-slate-400 ml-4">
          <li>Open the hamburger menu on mobile</li>
          <li>Scroll through all menu items</li>
          <li>Notice the custom scrollbar styling</li>
          <li>Test touch interactions with menu items</li>
        </ol>
      </motion.div>

      {/* Add some content to make the page scrollable too */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30"
        >
          <h3 className="text-cyan-300 font-semibold mb-2">Test Section {i + 1}</h3>
          <p className="text-slate-400 text-sm">
            This is test content to demonstrate the page scrolling behavior 
            alongside the mobile menu functionality.
          </p>
        </motion.div>
      ))}
    </div>
  );
}
