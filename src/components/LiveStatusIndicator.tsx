import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Clock, TrendingUp, Activity, Zap } from 'lucide-react';

interface LiveStatusIndicatorProps {
  className?: string;
}

interface UpdateInfo {
  type: 'data' | 'performance' | 'security' | 'feature';
  message: string;
  timestamp: Date;
}

const LiveStatusIndicator: React.FC<LiveStatusIndicatorProps> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [recentUpdates, setRecentUpdates] = useState<UpdateInfo[]>([]);
  const [performanceScore, setPerformanceScore] = useState(98);
  const [activeUsers, setActiveUsers] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const now = new Date();
      setLastUpdate(now);
      
      // Simulate performance monitoring
      setPerformanceScore(prev => Math.max(95, Math.min(100, prev + (Math.random() - 0.5) * 2)));
      
      // Simulate active users
      setActiveUsers(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      
      // Add random updates
      if (Math.random() < 0.3) {
        const updateTypes: UpdateInfo['type'][] = ['data', 'performance', 'security', 'feature'];
        const messages = [
          'Market data refreshed',
          'Performance optimized',
          'Security scan completed',
          'New features deployed',
          'Real-time data updated',
          'Analytics processed',
          'Cache refreshed',
          'System health check'
        ];
        
        const newUpdate: UpdateInfo = {
          type: updateTypes[Math.floor(Math.random() * updateTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: now
        };
        
        setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 4)]);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(updateInterval);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getUpdateIcon = (type: UpdateInfo['type']) => {
    switch (type) {
      case 'data': return <TrendingUp className="w-3 h-3" />;
      case 'performance': return <Zap className="w-3 h-3" />;
      case 'security': return <Activity className="w-3 h-3" />;
      case 'feature': return <Wifi className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getUpdateColor = (type: UpdateInfo['type']) => {
    switch (type) {
      case 'data': return 'text-blue-500';
      case 'performance': return 'text-green-500';
      case 'security': return 'text-orange-500';
      case 'feature': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ scale: isOnline ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 2, repeat: isOnline ? Infinity : 0 }}
            className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}
          />
          <span className="text-sm font-medium text-white">
            {isOnline ? 'Live & Active' : 'Offline'}
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-xs text-white/70">
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>{activeUsers} active</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>{performanceScore}%</span>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-white/80 mb-2">Recent Activity</h4>
        <AnimatePresence>
          {recentUpdates.map((update, index) => (
            <motion.div
              key={update.timestamp.getTime()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2 text-xs"
            >
              <div className={`${getUpdateColor(update.type)}`}>
                {getUpdateIcon(update.type)}
              </div>
              <span className="text-white/70 flex-1">{update.message}</span>
              <span className="text-white/50">
                {update.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Last Update */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Last updated</span>
          <span>{lastUpdate.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveStatusIndicator;
