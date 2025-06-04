import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Fuse from 'fuse.js';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Array<{
    id: string;
    title: string;
    tldr: string;
    content: string[];
  }>;
  onSectionSelect: (sectionId: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  sections,
  onSectionSelect,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof sections>([]);

  // Initialize Fuse.js for search
  const fuse = new Fuse(sections, {
    keys: ['title', 'content', 'tldr'],
    threshold: 0.4,
  });

  useEffect(() => {
    if (query.trim()) {
      const searchResults = fuse.search(query).map(result => result.item);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query, fuse]);

  const handleResultClick = (sectionId: string) => {
    onSectionSelect(sectionId);
    onClose();
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  };

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50 mx-4"
          >
            <div className="glass-effect rounded-2xl shadow-booth overflow-hidden">
              {/* Search Header */}
              <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search the report..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 font-poppins"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {query.trim() && results.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-poppins">
                    No results found for "{query}"
                  </div>
                )}

                {results.length > 0 && (
                  <div className="p-2">
                    {results.map((section, index) => (
                      <motion.button
                        key={section.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(section.id)}
                        className="w-full text-left p-4 rounded-lg hover:bg-primary-50 dark:hover:bg-navy-800/50 transition-colors"
                      >
                        <h3 
                          className="font-cinzel font-semibold text-gray-800 dark:text-gray-200 mb-1"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(section.title, query)
                          }}
                        />
                        <p 
                          className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 font-poppins"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(section.tldr, query)
                          }}
                        />
                      </motion.button>
                    ))}
                  </div>
                )}

                {!query.trim() && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="mb-4">
                      <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600" />
                    </div>
                    <h3 className="font-cinzel font-medium mb-2 text-gray-800 dark:text-gray-200">Search the Report</h3>
                    <p className="text-sm font-poppins">
                      Search through all sections, content, and key insights
                    </p>
                  </div>
                )}
              </div>

              {/* Search Tips */}
              {!query.trim() && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-navy-800/50">
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 font-poppins">
                    <div>💡 Try searching for: "population growth", "lakefront", "SWOT", or "housing"</div>
                    <div>🔍 Search is powered by fuzzy matching for better results</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal; 