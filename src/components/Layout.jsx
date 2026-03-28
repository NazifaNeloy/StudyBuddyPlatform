import React from 'react';
import Navigation from './Navigation';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0c0c0e] text-white">
      <Navigation />
      <main className="flex-1 overflow-x-hidden p-6 md:p-10 mb-24 md:mb-0 relative">
        {/* Background glow effects */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
