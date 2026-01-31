import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Home, ShoppingCart } from 'lucide-react';
import LiveStatusIndicator from './LiveStatusIndicator';
import RealTimeMetrics from './RealTimeMetrics';
import SystemHealthMonitor from './SystemHealthMonitor';

interface HeroSectionProps {
  data: {
    populationGrowth: number;
    populationGrowthPercent: number;
    medianHomePrice: number;
    homePriceGrowth: number;
    consumerSpendingGrowth: number;
  };
}

const CountUpAnimation: React.FC<{ end: number; duration?: number; prefix?: string; suffix?: string }> = ({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const metrics = [
    {
      icon: Users,
      value: data.populationGrowth,
      label: 'Population Growth (2021-2023)',
      suffix: ' added',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'from-primary-50 to-primary-100',
    },
    {
      icon: TrendingUp,
      value: data.populationGrowthPercent,
      label: 'Growth Rate',
      suffix: '%',
      color: 'from-secondary-500 to-secondary-600',
      bgColor: 'from-secondary-50 to-secondary-100',
    },
    {
      icon: Home,
      value: data.medianHomePrice / 1000,
      label: 'Median Home Price',
      prefix: '$',
      suffix: 'K',
      color: 'from-navy-500 to-navy-600',
      bgColor: 'from-navy-50 to-navy-100',
    },
    {
      icon: DollarSign,
      value: data.homePriceGrowth,
      label: 'Home Price Growth',
      suffix: '%',
      color: 'from-accent-500 to-accent-600',
      bgColor: 'from-accent-50 to-accent-100',
    },
    {
      icon: ShoppingCart,
      value: data.consumerSpendingGrowth,
      label: 'Consumer Spending',
      suffix: '%',
      color: 'from-primary-500 to-secondary-500',
      bgColor: 'from-primary-50 to-secondary-50',
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 booth-gradient animate-gradient-xy opacity-90" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-cinzel font-bold text-white mb-6"
          >
            Tri-Cities
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Market Report
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 font-poppins max-w-4xl mx-auto mb-8"
          >
            Comprehensive real-time analysis of Johnson City, Kingsport, and Bristol real estate markets
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.bgColor} flex items-center justify-center mb-3 mx-auto`}>
                  <metric.icon className={`w-6 h-6 text-gradient-to-br ${metric.color}`} />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    <CountUpAnimation
                      end={metric.value}
                      prefix={metric.prefix || ''}
                      suffix={metric.suffix || ''}
                    />
                  </div>
                  <div className="text-sm text-white/70 font-poppins">
                    {metric.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Live Status Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16"
        >
          <LiveStatusIndicator />
          <RealTimeMetrics />
          <SystemHealthMonitor />
        </motion.div>

        {/* Professional Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Real-time Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span>Live Monitoring</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span>Professional Grade</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 