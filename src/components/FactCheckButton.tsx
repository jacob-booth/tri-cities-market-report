import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle, AlertTriangle, X, ExternalLink } from 'lucide-react';
import factCheckData from '../data/factCheckDatabase.json';

interface FactCheckButtonProps {
  content: string;
  itemIndex?: number;
}

interface FactCheckResult {
  status: 'verified' | 'partially-verified' | 'needs-verification' | 'needs-context' | 'needs-clarification' | 'needs-correction' | 'inaccurate' | 'unverified';
  confidence: number;
  explanation: string;
  sources: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

// Improved content mapping system with more precise matching
const CONTENT_FACT_CHECK_MAP: Array<{
  keywords: string[];
  factCheckId: string;
  priority: number; // Higher priority = more specific match
}> = [
  // High priority - very specific claims
  { keywords: ['$392,000', '$392K', 'median home price reached $392'], factCheckId: 'home-price-johnson-city', priority: 10 },
  { keywords: ['2.1 violent crimes per 1,000', 'Crime rates significantly below'], factCheckId: 'johnson-city-crime-rate', priority: 10 },
  { keywords: ['21-hospital network', '21 hospitals'], factCheckId: 'ballad-health-hospital-count', priority: 10 },
  { keywords: ['95% graduation rate'], factCheckId: 'johnson-city-schools-graduation-rate', priority: 10 },
  { keywords: ['9.8% consumer spending', 'Consumer spending surged 9.8%'], factCheckId: 'consumer-spending-growth', priority: 10 },
  { keywords: ['$12,500 per-pupil spending'], factCheckId: 'per-pupil-spending', priority: 10 },
  { keywords: ['5.2%', 'core inflation rate'], factCheckId: 'core-inflation-rate', priority: 10 },
  
  // Medium priority - specific data points
  { keywords: ['73,635 residents', '3.6% growth since 2020'], factCheckId: 'johnson-city-population', priority: 8 },
  { keywords: ['57,109 residents', 'Kingsport follows', '27,867 residents'], factCheckId: 'kingsport-population', priority: 8 },
  { keywords: ['29.7% of residents aged 18-34'], factCheckId: 'age-distribution-claim', priority: 8 },
  { keywords: ['median age of 35.1', '35.1 years'], factCheckId: 'median-age', priority: 8 },
  { keywords: ['$55,400', 'Median household income'], factCheckId: 'median-household-income', priority: 8 },
  { keywords: ['3.0% unemployment', 'remarkably low unemployment'], factCheckId: 'unemployment-rate', priority: 8 },
  { keywords: ['398 new positions per month'], factCheckId: 'job-growth-rate', priority: 8 },
  { keywords: ['53%', 'Labor force participation'], factCheckId: 'labor-force-participation', priority: 8 },
  { keywords: ['15,000 employees', 'Ballad Health leads'], factCheckId: 'ballad-health-employees', priority: 8 },
  { keywords: ['7,000 workers', 'Eastman Chemical'], factCheckId: 'eastman-chemical-employees', priority: 8 },
  { keywords: ['2,500 direct employees', 'East Tennessee State University'], factCheckId: 'etsu-employees', priority: 8 },
  { keywords: ['$305,000 median price', '$209,000', 'Bristol remains'], factCheckId: 'kingsport-bristol-home-prices', priority: 8 },
  { keywords: ['472 homes for sale', '465 in Kingsport'], factCheckId: 'market-inventory-levels', priority: 8 },
  { keywords: ['53 days in Johnson City', '63 days in Kingsport'], factCheckId: 'days-on-market', priority: 8 },
  { keywords: ['$250,000 to over $1,000,000'], factCheckId: 'lakefront-price-range', priority: 8 },
  { keywords: ['75 days on Boone Lake', '60 days on Watauga Lake'], factCheckId: 'lakefront-days-on-market', priority: 8 },
  { keywords: ['30% above comparable inland', 'Boone Lake properties'], factCheckId: 'lakefront-property-premiums', priority: 8 },
  { keywords: ['72% growth from 2018-2024'], factCheckId: 'tennessee-housing-market-growth', priority: 8 },
  { keywords: ['4-6% annual home price appreciation'], factCheckId: 'tennessee-price-forecast', priority: 8 },
  { keywords: ['6.5-7.5% range', '6.0-6.5% by 2026'], factCheckId: 'mortgage-rate-projections', priority: 8 },
  { keywords: ['15% annually through 2027', '55+ relocations'], factCheckId: 'demographic-relocation-projections', priority: 8 },
  { keywords: ['$200M in planned', '1,500+ units'], factCheckId: 'development-pipeline', priority: 8 },
  { keywords: ['3 universities', 'ETSU, King University, and Tusculum'], factCheckId: 'university-count', priority: 8 },
  { keywords: ['1,200+ acres of parks', 'three major lakes'], factCheckId: 'parks-and-recreation', priority: 8 },
  { keywords: ['Nashville', '$550K', 'soaring'], factCheckId: 'nashville-median-home-price', priority: 8 },
  
  // Lower priority - general claims
  { keywords: ['most affordable market in East Tennessee'], factCheckId: 'tri-cities-affordability-claim', priority: 6 },
  { keywords: ['robust 3.5% population growth'], factCheckId: 'tri-cities-tldr-claim', priority: 6 },
  { keywords: ['economic diversity', 'healthcare, education, and manufacturing'], factCheckId: 'tri-cities-economy', priority: 6 },
  { keywords: ['12,682 people from 2021-2023'], factCheckId: 'regional-population-growth', priority: 6 },
  { keywords: ['poverty rates', 'economic health'], factCheckId: 'poverty-rate', priority: 6 }
];

const FactCheckButton: React.FC<FactCheckButtonProps> = ({ content, itemIndex = 0 }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [animatedText, setAnimatedText] = useState('');

  // Improved content matching algorithm
  const getFactCheckId = (text: string): string | null => {
    let bestMatch: { id: string; score: number } | null = null;
    
    for (const mapping of CONTENT_FACT_CHECK_MAP) {
      let matchScore = 0;
      let keywordMatches = 0;
      
      for (const keyword of mapping.keywords) {
        if (text.toLowerCase().includes(keyword.toLowerCase())) {
          keywordMatches++;
          matchScore += mapping.priority;
        }
      }
      
      // Only consider it a match if at least one keyword matches
      if (keywordMatches > 0) {
        // Bonus for multiple keyword matches
        matchScore += (keywordMatches - 1) * 2;
        
        if (!bestMatch || matchScore > bestMatch.score) {
          bestMatch = { id: mapping.factCheckId, score: matchScore };
        }
      }
    }
    
    return bestMatch?.id || null;
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
      case 'needs-correction':
      case 'inaccurate':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    if (!result) return '';
    
    switch (result.status) {
      case 'verified':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      case 'partially-verified':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
      case 'needs-verification':
      case 'needs-context':
      case 'needs-clarification':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700';
      case 'needs-correction':
      case 'inaccurate':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700';
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
      case 'needs-correction':
        return 'Needs Correction';
      case 'inaccurate':
        return 'Inaccurate';
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
                              result.confidence >= 40 ? 'bg-orange-500' :
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
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Analysis
                </h4>
                <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-[60px]">
                  {animatedText}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-gray-400 ml-1"
                  />
                </div>
              </div>

              {/* Sources */}
              {result.sources && result.sources.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Sources ({result.sources.length})
                  </h4>
                  <div className="space-y-3">
                    {result.sources.map((source, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 1 }}
                        className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                              {source.title}
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              {source.excerpt}
                            </p>
                          </div>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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