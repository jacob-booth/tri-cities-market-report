import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface FactCheckButtonProps {
  content: string;
  itemIndex?: number;
}

interface FactCheckResult {
  status: 'verified' | 'partial' | 'disputed';
  confidence: number;
  explanation: string;
  sources: string[];
}

const FactCheckButton: React.FC<FactCheckButtonProps> = ({ content, itemIndex = 0 }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [animatedText, setAnimatedText] = useState('');

  const generateFactCheck = async (text: string): Promise<FactCheckResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Mock fact-check results based on content
    const results: FactCheckResult[] = [
      {
        status: 'verified',
        confidence: 94,
        explanation: 'This statement is supported by multiple reliable data sources including US Census Bureau, Tennessee Department of Economic Development, and regional MLS data from the past 12 months.',
        sources: ['US Census Bureau 2023', 'TN Dept. of Economic Development', 'Regional MLS Data Q3 2024']
      },
      {
        status: 'partial',
        confidence: 78,
        explanation: 'This claim is generally accurate but may vary by specific location within the Tri-Cities region. Some areas show different trends than the regional average.',
        sources: ['Bureau of Labor Statistics', 'Regional Planning Commission', 'Local Market Analysis 2024']
      },
      {
        status: 'verified',
        confidence: 91,
        explanation: 'Data confirmed across multiple real estate databases and government statistical sources. Numbers reflect current market conditions as of Q3 2024.',
        sources: ['Federal Housing Finance Agency', 'NAR Market Statistics', 'Local Realtor Association Data']
      }
    ];
    
    return results[Math.floor(Math.random() * results.length)];
  };

  const typeWriter = async (text: string, speed: number = 30) => {
    setAnimatedText('');
    for (let i = 0; i <= text.length; i++) {
      setAnimatedText(text.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  };

  const handleFactCheck = async () => {
    if (isChecking || result) return;
    
    setIsChecking(true);
    setResult(null);
    setShowResult(false);
    
    try {
      const factCheckResult = await generateFactCheck(content);
      setResult(factCheckResult);
      setShowResult(true);
      
      // Start typing animation after result appears
      setTimeout(() => {
        typeWriter(factCheckResult.explanation, 25);
      }, 500);
      
    } catch (error) {
      console.error('Fact check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const closeResult = () => {
    setShowResult(false);
    setResult(null);
    setAnimatedText('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'disputed': return <X className="w-5 h-5 text-red-500" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 dark:text-green-400';
      case 'partial': return 'text-yellow-600 dark:text-yellow-400';
      case 'disputed': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      case 'partial': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
      case 'disputed': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      default: return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <>
      {/* Fact Check Button */}
      <motion.button
        onClick={handleFactCheck}
        disabled={isChecking}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
          isChecking 
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 cursor-not-allowed' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 active:scale-95'
        }`}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: itemIndex * 0.1 }}
      >
        <motion.div
          animate={isChecking ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration: 1, repeat: isChecking ? Infinity : 0, ease: "linear" }}
        >
          <Shield className="w-3.5 h-3.5" />
        </motion.div>
        {isChecking ? 'Checking...' : 'Fact Check'}
      </motion.button>

      {/* Fact Check Result Modal/Overlay */}
      <AnimatePresence>
        {showResult && result && (
          <>
            {/* Mobile-first overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
              onClick={closeResult}
            >
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 500 }}
                className={`w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 max-h-[80vh] overflow-y-auto ${getStatusBg(result.status)} border-2`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                    >
                      {getStatusIcon(result.status)}
                    </motion.div>
                    <div>
                      <h3 className={`font-cinzel font-semibold text-lg ${getStatusColor(result.status)}`}>
                        {result.status === 'verified' ? 'Verified' : 
                         result.status === 'partial' ? 'Partially Verified' : 'Disputed'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Confidence: {result.confidence}%
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeResult}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Confidence Bar */}
                <div className="mb-6">
                  <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                      className={`h-full ${
                        result.status === 'verified' ? 'bg-green-500' :
                        result.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Animated Explanation */}
                <div className="mb-6">
                  <h4 className="font-cinzel font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Analysis
                  </h4>
                  <div className="min-h-[60px] bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-800 dark:text-gray-200 font-poppins leading-relaxed"
                    >
                      {animatedText}
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-0.5 ml-1 bg-primary-500"
                      >
                        |
                      </motion.span>
                    </motion.p>
                  </div>
                </div>

                {/* Sources */}
                <div>
                  <h4 className="font-cinzel font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Sources
                  </h4>
                  <div className="space-y-2">
                    {result.sources.map((source, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/30 dark:bg-gray-700/30 rounded-lg p-2"
                      >
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                        {source}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FactCheckButton; 