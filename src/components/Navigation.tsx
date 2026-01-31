import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Moon, Sun, FileText, Menu, X } from 'lucide-react';
import { useTheme } from '../store/useAppStore';
import type { Section } from '../utils/validateReport';

interface NavigationProps {
  sections: Section[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onSearchClick: () => void;
  onGlossaryClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  sections,
  activeSection,
  onNavigate,
  onSearchClick,
  onGlossaryClick,
}) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const totalScrollableHeight = documentHeight - windowHeight;
      
      // Calculate progress as percentage of total scrollable content
      const progress = Math.min(100, Math.max(0, (currentScrollY / totalScrollableHeight) * 100));
      setScrollProgress(progress);
      
      // Show/hide navigation based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once to set initial value
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMenuOpen(false); // Close menu on navigation
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="h-full booth-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-2 left-0 right-0 z-40 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-effect rounded-2xl px-4 lg:px-6 py-3 shadow-booth">
            <div className="flex items-center justify-between gap-4">
              {/* BOOTH Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 flex-shrink-0"
              >
                <div className="w-7 h-7 flex items-center justify-center">
                  <img 
                    src="./booth-logo.png" 
                    alt="BOOTH" 
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <span className="font-cinzel text-lg font-semibold text-booth-gradient">
                  BOOTH
                </span>
              </motion.div>

              {/* Navigation Links - Desktop */}
              <div className="hidden xl:flex items-center gap-2 flex-1 max-w-4xl overflow-x-auto scrollbar-hide px-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavClick(section.id)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeSection === section.id
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }`}
                  >
                    {section.title}
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Menu Button - Show on medium/large screens that hide full nav */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="xl:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  aria-label="Toggle menu"
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.button>

                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSearchClick}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  aria-label="Search report content"
                >
                  <Search className="w-5 h-5" />
                </motion.button>

                {/* Glossary Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGlossaryClick}
                  className="hidden sm:block p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  aria-label="Open glossary and citations"
                >
                  <FileText className="w-5 h-5" />
                </motion.button>

                {/* Dark Mode Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>

            {/* Dropdown Menu - For medium/large screens without full nav */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="xl:hidden mt-3 pt-3 border-t border-white/20 dark:border-gray-700/50"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                    {sections.map((section) => (
                      <motion.button
                        key={section.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleNavClick(section.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                          activeSection === section.id
                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                            : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700/30'
                        }`}
                      >
                        {section.title}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-effect rounded-2xl px-4 py-3 shadow-booth"
        >
          <div className="flex items-center justify-around">
            {sections.slice(0, 3).map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavClick(section.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeSection === section.id
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {section.title.split(' ')[0]}
              </motion.button>
            ))}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSearchClick}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300"
            >
              <Search className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Navigation; 