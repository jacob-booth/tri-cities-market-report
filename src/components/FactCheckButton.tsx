import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, X, ExternalLink } from 'lucide-react';
import factCheckData from '../data/factCheckDatabase.json';

interface FactCheckButtonProps {
  content: string;
  itemIndex?: number;
}

interface FactCheckResult {
  status: 'verified' | 'partially-verified' | 'needs-verification' | 'needs-context' | 'needs-clarification' | 'unverified';
  confidence: number;
  explanation: string;
  sources: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

const FactCheckButton: React.FC<FactCheckButtonProps> = ({ content, itemIndex = 0 }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [animatedText, setAnimatedText] = useState('');

  // Map content to fact-check database entries
  const getFactCheckId = (text: string): string | null => {
    const contentMap: Record<string, string> = {
      // Population data
      'Johnson City serves as the regional population center with 73,635 residents': 'johnson-city-population',
      'Regional population grew by 12,682 people from 2021-2023': 'regional-population-growth',
      'Johnson City leading at 73,635 residents': 'johnson-city-population',
      
      // Income data
      'Median household income of $55,400 in Johnson City': 'median-household-income',
      'provides strong purchasing power': 'median-household-income',
      
      // Age demographics
      "The region's median age of 35.1 years": 'median-age',
      'healthy balance of working professionals': 'median-age',
      
      // Employment data
      'Ballad Health leads regional employment with approximately 15,000 employees': 'ballad-health-employees',
      'Ballad Health (~15,000 employees)': 'ballad-health-employees',
      'Eastman Chemical Company in Kingsport employs approximately 7,000 workers': 'eastman-chemical-employees',
      'The region maintained a remarkably low 3.0% unemployment rate': 'unemployment-rate',
      'East Tennessee State University contributes over 2,500 direct employees': 'etsu-employees',
      'ETSU': 'etsu-employees',
      
      // Economic indicators
      'Consumer spending surged 9.8% in 2023': 'consumer-spending-growth',
      'strong economic resilience': 'poverty-rate',
      'economic diversity': 'tri-cities-economy',
      'healthcare, education, and manufacturing serving as primary pillars': 'tri-cities-economy',
      'The Tri-Cities economy demonstrates exceptional diversity': 'tri-cities-economy',
      
      // Housing market data
      "Johnson City's median home price reached $392,000": 'home-price-johnson-city',
      'remarkable 72% growth from 2018-2024': 'tennessee-housing-market-growth',
      'Nashville': 'nashville-median-home-price',
      'soaring to over $550K': 'nashville-median-home-price',
      '4-6% annual home price appreciation through 2026': 'tennessee-price-forecast',
      'Conservative projections indicate': 'tennessee-price-forecast',
      
      // Lakefront properties
      'Boone Lake properties command the highest premiums': 'lakefront-property-premiums',
      '30% above comparable inland homes': 'lakefront-property-premiums',
      
      // General economic health
      'economic health': 'poverty-rate'
    };

    // Find the best match for the content
    for (const [key, id] of Object.entries(contentMap)) {
      if (text.includes(key)) {
        return id;
      }
    }
    
    return null;
  };

  const getFactCheckResult = (text: string): FactCheckResult | null => {
    const factCheckId = getFactCheckId(text);
    if (!factCheckId || !(factCheckData.factChecks as any)[factCheckId]) {
      return null;
    }

    const data = (factCheckData.factChecks as any)[factCheckId];
    return {
      status: data.status as FactCheckResult['status'],
      confidence: data.confidence,
      explanation: data.explanation,
      sources: data.sources
    };
  };

  const typewriterEffect = async (text: string) => {
    setAnimatedText('');
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20));
      setAnimatedText(text.slice(0, i));
    }
  };

  const handleFactCheck = async () => {
    setIsChecking(true);
    setShowResult(false);
    setAnimatedText('');

    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const factCheckResult = getFactCheckResult(content);
    
    if (factCheckResult) {
      setResult(factCheckResult);
      setShowResult(true);
      setIsChecking(false);
      
      // Start typewriter effect for explanation
      await typewriterEffect(factCheckResult.explanation);
    } else {
      // Fallback for content without pre-fact-checked data
      const fallbackResult: FactCheckResult = {
        status: 'unverified',
        confidence: 0,
        explanation: 'This claim has not been fact-checked yet. We are working to verify all content with reliable sources.',
        sources: []
      };
      
      setResult(fallbackResult);
      setShowResult(true);
      setIsChecking(false);
      await typewriterEffect(fallbackResult.explanation);
    }
  };

  const getStatusIcon = () => {
    if (!result) return null;
    
    switch (result.status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partially-verified':
        return <CheckCircle className="w-5 h-5 text-yellow-500" />;
      case 'needs-verification':
      case 'needs-context':
      case 'needs-clarification':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (!result) return 'bg-gray-100';
    
    switch (result.status) {
      case 'verified':
        return 'bg-green-50 border-green-200';
      case 'partially-verified':
        return 'bg-yellow-50 border-yellow-200';
      case 'needs-verification':
      case 'needs-context':
      case 'needs-clarification':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const getStatusLabel = () => {
    if (!result) return '';
    
    switch (result.status) {
      case 'verified':
        return 'Verified';
      case 'partially-verified':
        return 'Partially Verified';
      case 'needs-verification':
        return 'Needs Verification';
      case 'needs-context':
        return 'Needs Context';
      case 'needs-clarification':
        return 'Needs Clarification';
      default:
        return 'Unverified';
    }
  };

  return (
    <>
      {/* Fact Check Button */}
      <motion.button
        onClick={handleFactCheck}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-200"
      >
        <motion.div
          animate={isChecking ? { rotate: 360 } : { rotate: 0 }}
          transition={isChecking ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
        >
          <Shield className="w-3.5 h-3.5" />
        </motion.div>
        {isChecking ? 'Checking...' : 'Fact Check'}
      </motion.button>

      {/* Fact Check Modal */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 p-6 shadow-2xl ${getStatusColor()} backdrop-blur-md`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon()}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Fact Check Result
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {getStatusLabel()}
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={`h-full rounded-full ${
                              result.confidence >= 80 ? 'bg-green-500' :
                              result.confidence >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {result.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowResult(false)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Explanation */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Analysis
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {animatedText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>

              {/* Sources */}
              {result.sources && result.sources.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Sources
                  </h4>
                  <div className="space-y-3">
                    {result.sources.map((source, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                              {source.title}
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              "{source.excerpt}"
                            </p>
                          </div>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-1 text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FactCheckButton; 