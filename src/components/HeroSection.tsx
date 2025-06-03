import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Home, ShoppingCart } from 'lucide-react';

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
      label: 'Population Growth',
      suffix: ' residents',
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 booth-gradient animate-gradient-xy opacity-90" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
            style={{
              left: `${10 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        {/* BOOTH Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src="/booth-logo.png" 
              alt="BOOTH" 
              className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
            />
            <h1 className="font-cinzel text-6xl lg:text-8xl font-bold text-white drop-shadow-2xl">
              BOOTH
            </h1>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6" />
          <p className="text-xl lg:text-2xl font-poppins text-white/90 max-w-3xl mx-auto leading-relaxed">
            Comprehensive Market Research & Analysis
          </p>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="mb-12"
        >
          <h2 className="font-cinzel text-3xl lg:text-4xl xl:text-5xl font-semibold text-white mb-6 leading-tight">
            Tri-Cities Residential Real Estate Market
          </h2>
          <p className="text-lg lg:text-xl font-poppins text-white/80 max-w-4xl mx-auto leading-relaxed">
            Johnson City • Kingsport • Bristol, Tennessee
          </p>
        </motion.div>

        {/* Key Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.8 + index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              className="metric-card bg-white/20 backdrop-blur-lg border-white/30 hover:bg-white/30 text-white"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${metric.bgColor} mb-4 text-navy-700`}>
                <metric.icon className="w-8 h-8" />
              </div>
              
              <div className="text-3xl lg:text-4xl font-cinzel font-bold mb-2 text-white">
                <CountUpAnimation
                  end={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  duration={2500 + index * 200}
                />
              </div>
              
              <p className="text-sm lg:text-base font-poppins text-white/80 font-medium">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
          className="mt-16"
        >
          <p className="text-lg font-poppins text-white/70 mb-8 max-w-2xl mx-auto">
            Explore comprehensive insights into Tennessee's most affordable and rapidly growing market
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => document.getElementById('executive-summary')?.scrollIntoView({ behavior: 'smooth' })}
              className="booth-button bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 hover:border-white/50"
            >
              Explore Report
            </button>
            
            <button 
              onClick={() => document.getElementById('swot-analysis')?.scrollIntoView({ behavior: 'smooth' })}
              className="booth-button-outline border-white/50 text-white hover:bg-white hover:text-navy-900"
            >
              View Analysis
            </button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 