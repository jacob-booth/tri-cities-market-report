import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Database, Shield, Zap, Activity, CheckCircle, AlertCircle } from 'lucide-react';

interface SystemHealthMonitorProps {
  className?: string;
}

interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'error';
  responseTime: number;
  uptime: number;
  icon: React.ReactNode;
}

const SystemHealthMonitor: React.FC<SystemHealthMonitorProps> = ({ className = '' }) => {
  const [systems, setSystems] = useState<SystemStatus[]>([
    {
      id: 'api-server',
      name: 'API Server',
      status: 'online',
      responseTime: 45,
      uptime: 99.9,
      icon: <Server className="w-4 h-4" />
    },
    {
      id: 'database',
      name: 'Database',
      status: 'online',
      responseTime: 12,
      uptime: 99.8,
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'security',
      name: 'Security Layer',
      status: 'online',
      responseTime: 8,
      uptime: 100,
      icon: <Shield className="w-4 h-4" />
    },
    {
      id: 'cache',
      name: 'Cache System',
      status: 'online',
      responseTime: 3,
      uptime: 99.7,
      icon: <Zap className="w-4 h-4" />
    }
  ]);

  const [overallHealth, setOverallHealth] = useState(98.5);
  const [lastCheck, setLastCheck] = useState(new Date());

  // Simulate system health monitoring
  useEffect(() => {
    const healthInterval = setInterval(() => {
      setSystems(prev => prev.map(system => {
        // Simulate occasional issues
        const randomIssue = Math.random() < 0.1;
        const randomWarning = Math.random() < 0.05;
        
        let newStatus = system.status;
        let newResponseTime = system.responseTime;
        let newUptime = system.uptime;
        
        if (randomIssue) {
          newStatus = 'error';
          newResponseTime = Math.min(500, system.responseTime * (1 + Math.random()));
          newUptime = Math.max(95, system.uptime - Math.random() * 2);
        } else if (randomWarning) {
          newStatus = 'warning';
          newResponseTime = Math.min(200, system.responseTime * (1 + Math.random() * 0.5));
          newUptime = Math.max(98, system.uptime - Math.random() * 0.5);
        } else {
          newStatus = 'online';
          newResponseTime = Math.max(1, system.responseTime * (0.8 + Math.random() * 0.4));
          newUptime = Math.min(100, system.uptime + Math.random() * 0.1);
        }
        
        return {
          ...system,
          status: newStatus,
          responseTime: parseFloat(newResponseTime.toFixed(1)),
          uptime: parseFloat(newUptime.toFixed(1))
        };
      }));
      
      // Calculate overall health
      const avgUptime = systems.reduce((sum, sys) => sum + sys.uptime, 0) / systems.length;
      setOverallHealth(parseFloat(avgUptime.toFixed(1)));
      setLastCheck(new Date());
    }, 10000); // Check every 10 seconds

    return () => clearInterval(healthInterval);
  }, [systems]);

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">System Health Monitor</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-white/70" />
            <span className="text-sm text-white/70">Overall Health</span>
            <span className={`text-lg font-bold ${
              overallHealth >= 99 ? 'text-green-400' : 
              overallHealth >= 95 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {overallHealth}%
            </span>
          </div>
          <span className="text-xs text-white/50">
            Last check: {lastCheck.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {systems.map((system) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="text-white/70">
                    {system.icon}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {system.name}
                  </span>
                </div>
                <div className={`${getStatusColor(system.status)}`}>
                  {getStatusIcon(system.status)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Response Time</span>
                  <span className={`font-medium ${
                    system.responseTime < 50 ? 'text-green-400' :
                    system.responseTime < 100 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {system.responseTime}ms
                  </span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Uptime</span>
                  <span className={`font-medium ${
                    system.uptime >= 99.5 ? 'text-green-400' :
                    system.uptime >= 98 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {system.uptime}%
                  </span>
                </div>
                
                {/* Status indicator */}
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ 
                      scale: system.status === 'online' ? [1, 1.2, 1] : 1,
                      opacity: system.status === 'online' ? [0.7, 1, 0.7] : 0.7
                    }}
                    transition={{ duration: 2, repeat: system.status === 'online' ? Infinity : 0 }}
                    className={`w-2 h-2 rounded-full ${
                      system.status === 'online' ? 'bg-green-400' :
                      system.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                  />
                  <span className={`text-xs capitalize ${
                    system.status === 'online' ? 'text-green-400' :
                    system.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {system.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* System Info */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Monitoring 4 critical systems</span>
          <span>Auto-refresh every 10s</span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;
