import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const DynamicBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Simple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-navy-950 dark:via-gray-900 dark:to-navy-900" />
      
      {/* Subtle Parallax Gradient */}
      <motion.div
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{
          transform: `translateY(${scrollY * 0.02}px)`,
        }}
      >
        <div className="absolute top-1/4 left-0 w-2/3 h-1/3 bg-gradient-to-br from-transparent via-primary-100/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-1/2 h-1/3 bg-gradient-to-bl from-transparent via-secondary-100/10 to-transparent rounded-full blur-3xl" />
      </motion.div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.008] dark:opacity-[0.015]">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #D534FF 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>
    </div>
  );
};

export default DynamicBackground; 