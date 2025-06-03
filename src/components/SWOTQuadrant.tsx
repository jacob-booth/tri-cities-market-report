import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, TrendingUp, AlertTriangle } from 'lucide-react';
import type { SWOTData } from '../types/report';

interface SWOTQuadrantProps {
  swot: SWOTData;
}

const SWOTQuadrant: React.FC<SWOTQuadrantProps> = ({ swot }) => {
  const [activeQuadrant, setActiveQuadrant] = useState<string | null>(null);

  const quadrants = [
    {
      key: 'strengths',
      title: 'Strengths',
      items: swot.strengths,
      color: 'from-green-500 to-emerald-600',
      icon: Plus,
      textColor: 'text-green-800',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      key: 'weaknesses',
      title: 'Weaknesses',
      items: swot.weaknesses,
      color: 'from-red-500 to-rose-600',
      icon: Minus,
      textColor: 'text-red-800',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      key: 'opportunities',
      title: 'Opportunities',
      items: swot.opportunities,
      color: 'from-blue-500 to-indigo-600',
      icon: TrendingUp,
      textColor: 'text-blue-800',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      key: 'threats',
      title: 'Threats',
      items: swot.threats,
      color: 'from-orange-500 to-amber-600',
      icon: AlertTriangle,
      textColor: 'text-orange-800',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6">
        SWOT Analysis
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {quadrants.map((quadrant) => {
          const Icon = quadrant.icon;
          const isActive = activeQuadrant === quadrant.key;
          
          return (
            <motion.div
              key={quadrant.key}
              className={`${quadrant.bgColor} rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                isActive ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveQuadrant(isActive ? null : quadrant.key)}
            >
              <div className="flex items-center space-x-2 mb-3">
                <div className={`bg-gradient-to-r ${quadrant.color} p-2 rounded-lg`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h4 className={`font-semibold ${quadrant.textColor} dark:text-white`}>
                  {quadrant.title}
                </h4>
              </div>
              
              <div className="space-y-2">
                {quadrant.items.slice(0, isActive ? undefined : 2).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    • {item}
                  </motion.div>
                ))}
                
                {!isActive && quadrant.items.length > 2 && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    +{quadrant.items.length - 2} more...
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
        Click on any quadrant to expand and see all items
      </div>
    </div>
  );
};

export default SWOTQuadrant; 