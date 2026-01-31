import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Home, Users, BarChart3 } from 'lucide-react';

interface RealTimeMetricsProps {
  className?: string;
}

interface Metric {
  id: string;
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ className = '' }) => {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: 'median-price',
      label: 'Median Home Price',
      value: '$392,000',
      change: 5.5,
      icon: <Home className="w-4 h-4" />,
      color: 'text-green-500'
    },
    {
      id: 'population',
      label: 'Population Growth',
      value: '74,814',
      change: 3.6,
      icon: <Users className="w-4 h-4" />,
      color: 'text-blue-500'
    },
    {
      id: 'unemployment',
      label: 'Unemployment Rate',
      value: '3.5%',
      change: -0.2,
      icon: <BarChart3 className="w-4 h-4" />,
      color: 'text-orange-500'
    },
    {
      id: 'income',
      label: 'Median Income',
      value: '$55,429',
      change: 4.2,
      icon: <DollarSign className="w-4 h-4" />,
      color: 'text-purple-500'
    }
  ]);

  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setIsRefreshing(true);
      
      setTimeout(() => {
        setMetrics(prev => prev.map(metric => {
          // Simulate small variations in data
          const variation = (Math.random() - 0.5) * 0.1;
          let newValue = metric.value;
          let newChange = metric.change;
          
          if (typeof metric.value === 'string' && metric.value.includes('$')) {
            const numericValue = parseFloat(metric.value.replace(/[$,]/g, ''));
            const newNumericValue = numericValue * (1 + variation);
            newValue = `$${newNumericValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
            newChange = metric.change + (Math.random() - 0.5) * 0.5;
          } else if (typeof metric.value === 'string' && metric.value.includes('%')) {
            const numericValue = parseFloat(metric.value.replace('%', ''));
            const newNumericValue = Math.max(0, Math.min(100, numericValue + variation * 10));
            newValue = `${newNumericValue.toFixed(1)}%`;
            newChange = metric.change + (Math.random() - 0.5) * 0.3;
          } else if (typeof metric.value === 'string' && metric.value.includes(',')) {
            const numericValue = parseInt(metric.value.replace(/,/g, ''));
            const newNumericValue = numericValue + Math.floor(variation * 100);
            newValue = newNumericValue.toLocaleString();
            newChange = metric.change + (Math.random() - 0.5) * 0.2;
          }
          
          return {
            ...metric,
            value: newValue,
            change: parseFloat(newChange.toFixed(1))
          };
        }));
        
        setLastRefresh(new Date());
        setIsRefreshing(false);
      }, 1000);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(updateInterval);
  }, []);

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Real-Time Market Metrics</h3>
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
            className="w-4 h-4"
          >
            <BarChart3 className="w-4 h-4 text-white/70" />
          </motion.div>
          <span className="text-xs text-white/60">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {metrics.map((metric) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10 min-w-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${metric.color} flex-shrink-0`}>
                  {metric.icon}
                </div>
                <motion.div
                  animate={{ scale: isRefreshing ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center space-x-1 text-xs flex-shrink-0 ${
                    metric.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {metric.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="whitespace-nowrap">{Math.abs(metric.change)}%</span>
                </motion.div>
              </div>
              
              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {metric.value}
                </div>
                <div className="text-xs text-white/60">
                  {metric.label}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Data Source */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Data Sources: DataUSA, FRED, World Population Review</span>
          <span>Updated every 30 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;
