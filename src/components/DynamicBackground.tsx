import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const DynamicBackground: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [shapes, setShapes] = useState<FloatingShape[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Generate floating shapes
    const generateShapes = () => {
      const newShapes: FloatingShape[] = [];
      const colors = [
        'rgba(213, 52, 255, 0.1)',   // Primary purple
        'rgba(36, 99, 255, 0.08)',   // Secondary blue
        'rgba(13, 17, 104, 0.06)',   // Navy
        'rgba(20, 184, 166, 0.08)',  // Teal
        'rgba(251, 191, 36, 0.05)',  // Amber
      ];

      for (let i = 0; i < 15; i++) {
        newShapes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 120 + 40,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 20 + 30,
          delay: Math.random() * -20,
        });
      }
      setShapes(newShapes);
    };

    generateShapes();
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary-50/30 dark:from-navy-950 dark:via-gray-900 dark:to-navy-900" />
      
      {/* Animated Mesh Gradient */}
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={
          {
            transform: `translateY(${scrollY * 0.1}px)`,
          }
        }
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-primary-100/20 to-transparent" />
        <div className="absolute top-1/3 right-0 w-2/3 h-2/3 bg-gradient-to-bl from-transparent via-secondary-100/15 to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-transparent via-teal-100/10 to-transparent" />
      </motion.div>

      {/* Floating Shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full blur-sm"
          style={
            {
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              backgroundColor: shape.color,
              transform: `translateY(${scrollY * (0.02 + shape.id * 0.01)}px)`,
            }
          }
          animate={
            {
              x: [0, 30, -20, 0],
              y: [0, -40, 20, 0],
              scale: [1, 1.1, 0.9, 1],
              rotate: [0, 180, 360],
            }
          }
          transition={
            {
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }
        />
      ))}

      {/* Flowing Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D534FF" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#2463FF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0D1168" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M0,100 Q150,200 300,100 T600,100"
          fill="none"
          stroke="url(#flowGradient)"
          strokeWidth="2"
          style={
            {
              transform: `translateY(${scrollY * 0.05}px)`,
            }
          }
          animate={
            {
              d: [
                "M0,100 Q150,200 300,100 T600,100",
                "M0,120 Q150,50 300,150 T600,80",
                "M0,80 Q150,180 300,90 T600,120",
                "M0,100 Q150,200 300,100 T600,100",
              ],
            }
          }
          transition={
            {
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }
        />
        
        <motion.path
          d="M100,300 Q250,400 400,300 T700,300"
          fill="none"
          stroke="url(#flowGradient)"
          strokeWidth="1.5"
          style={
            {
              transform: `translateY(${scrollY * 0.03}px)`,
            }
          }
          animate={
            {
              d: [
                "M100,300 Q250,400 400,300 T700,300",
                "M100,350 Q250,250 400,330 T700,280",
                "M100,280 Q250,380 400,290 T700,320",
                "M100,300 Q250,400 400,300 T700,300",
              ],
            }
          }
          transition={
            {
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: -2,
            }
          }
        />
      </svg>

      {/* Parallax Geometric Shapes */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/6 w-32 h-32 border border-primary-200/30 dark:border-primary-700/30 rotate-45"
          style={
            {
              transform: `translateY(${scrollY * 0.15}px) rotate(45deg)`,
            }
          }
          animate={
            {
              rotate: [45, 225, 405],
              borderColor: [
                'rgba(213, 52, 255, 0.3)',
                'rgba(36, 99, 255, 0.3)',
                'rgba(213, 52, 255, 0.3)',
              ],
            }
          }
          transition={
            {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }
          }
        />
        
        <motion.div
          className="absolute top-2/3 right-1/5 w-24 h-24 rounded-full border-2 border-secondary-200/40 dark:border-secondary-700/40"
          style={
            {
              transform: `translateY(${scrollY * 0.08}px)`,
            }
          }
          animate={
            {
              scale: [1, 1.2, 1],
              borderColor: [
                'rgba(36, 99, 255, 0.4)',
                'rgba(20, 184, 166, 0.4)',
                'rgba(36, 99, 255, 0.4)',
              ],
            }
          }
          transition={
            {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }
        />
        
        <motion.div
          className="absolute top-1/2 left-3/4 w-16 h-16 bg-gradient-to-br from-teal-200/20 to-amber-200/20 dark:from-teal-700/20 dark:to-amber-700/20 transform rotate-12"
          style={
            {
              transform: `translateY(${scrollY * 0.12}px) rotate(12deg)`,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }
          }
          animate={
            {
              rotate: [12, 192, 372],
            }
          }
          transition={
            {
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }
          }
        />
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]">
        <div className="w-full h-full" style={
          {
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #D534FF 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #2463FF 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 40px 40px',
            backgroundPosition: '0 0, 30px 30px'
          }
        } />
      </div>
    </div>
  );
};

export default DynamicBackground; 