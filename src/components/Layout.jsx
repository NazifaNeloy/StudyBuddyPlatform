import React from 'react';
import Navigation from './Navigation';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background text-on-surface selection:bg-brand-purple selection:text-white antialiased">
      <Navigation />
      <main className="flex-1 md:ml-64 overflow-x-hidden p-6 md:p-10 mb-24 md:mb-0 relative">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
           className="max-w-[1600px] mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
