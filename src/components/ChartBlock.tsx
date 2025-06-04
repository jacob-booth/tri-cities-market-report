import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ChartData } from '../types/report';

interface ChartBlockProps {
  chart: ChartData;
}

const COLORS = ['#0f766e', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'];

const ChartBlock: React.FC<ChartBlockProps> = ({ chart }) => {
  const renderChart = () => {
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey={
                  chart.data[0]?.metric ? 'metric' :
                  chart.data[0]?.city ? 'city' : 
                  chart.data[0]?.sector ? 'sector' : 'name'
                }
                className="text-xs fill-gray-600 dark:fill-gray-400"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                className="text-xs fill-gray-600 dark:fill-gray-400"
                domain={[0, 10]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  color: '#374151'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'score') return [`${value}/10`, 'Score'];
                  if (name === 'population') return [value.toLocaleString(), 'Population'];
                  if (name === 'employment') return [value.toLocaleString(), 'Employment'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar 
                dataKey={
                  chart.data[0]?.score ? 'score' :
                  chart.data[0]?.population ? 'population' : 
                  chart.data[0]?.employment ? 'employment' : 'value'
                }
                fill="url(#barGradient)" 
                radius={[4, 4, 0, 0]}
                stroke="#14b8a6"
                strokeWidth={1}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#0f766e" 
                strokeWidth={3}
                dot={{ fill: '#0f766e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#0f766e', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ age, value }) => `${age}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chart.data.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`${value}%`, 'Percentage']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="booth-card"
    >
      <h3 className="text-lg font-cinzel font-semibold text-navy-900 dark:text-gray-100 mb-4">
        {chart.title}
      </h3>
      <div className="w-full">
        {renderChart()}
      </div>
    </motion.div>
  );
};

export default ChartBlock; 