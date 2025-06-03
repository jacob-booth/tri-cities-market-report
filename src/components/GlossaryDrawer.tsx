import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

interface Citation {
  id: number;
  title: string;
  url: string;
  context: string;
}

interface GlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  citations: Citation[];
  selectedCitation?: number | null;
}

const GlossaryDrawer: React.FC<GlossaryDrawerProps> = ({
  isOpen,
  onClose,
  citations,
  selectedCitation = null,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-effect shadow-booth z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="./booth-logo.png" 
                    alt="BOOTH" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h2 className="text-xl font-cinzel font-semibold text-gray-800 dark:text-gray-100">
                  References & Citations
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {selectedCitation ? (
                // Show specific citation
                <>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-poppins mb-4">
                    Citation #{selectedCitation}
                  </div>
                  {citations
                    .filter(citation => citation.id === selectedCitation)
                    .map(citation => (
                      <motion.div
                        key={citation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="booth-card"
                      >
                        <h3 className="font-cinzel font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          {citation.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-poppins">
                          {citation.context}
                        </p>
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm transition-colors font-poppins"
                        >
                          <ExternalLink size={14} />
                          <span>View Source</span>
                        </a>
                      </motion.div>
                    ))}
                </>
              ) : (
                // Show all citations
                <>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-poppins">
                    All sources and references used in this report
                  </div>
                  {citations.map((citation, index) => (
                    <motion.div
                      key={citation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="booth-card hover:shadow-2xl"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 booth-gradient text-white text-xs rounded-full flex items-center justify-center font-cinzel font-medium">
                          {citation.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-cinzel font-semibold text-gray-800 dark:text-gray-200 mb-1">
                            {citation.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-poppins">
                            {citation.context}
                          </p>
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm transition-colors font-poppins"
                          >
                            <ExternalLink size={12} />
                            <span>View Source</span>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-navy-900/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-poppins">
                All data sources have been verified for accuracy and reliability by the BOOTH Research Team
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlossaryDrawer; 