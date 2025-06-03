import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sun, FileText } from 'lucide-react';
import type { Section } from '../types/report';

interface NavigationProps {
  sections: Section[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onSearchClick: () => void;
  onGlossaryClick: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  sections,
  activeSection,
  onNavigate,
  onSearchClick,
  onGlossaryClick,
  darkMode,
  onDarkModeToggle,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
        className="fixed top-1 left-0 right-0 z-40 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass-effect rounded-2xl px-6 py-4 shadow-booth">
            <div className="flex items-center justify-between">
              {/* BOOTH Logo */}
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                      src="/booth-logo.png" 
                      alt="BOOTH" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <span className="font-cinzel text-xl font-semibold text-booth-gradient hidden sm:block">
                    BOOTH
                  </span>
                </motion.div>
              </div>

              {/* Section Navigation */}
              <div className="hidden lg:flex items-center space-x-1 max-w-2xl overflow-x-auto">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => handleNavClick(section.id)}
                    className={`navigation-item px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                      activeSection === section.id ? 'active' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {section.title}
                  </motion.button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Search */}
                <motion.button
                  onClick={onSearchClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg glass-effect hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                  title="Search Report"
                >
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>

                {/* Glossary */}
                <motion.button
                  onClick={onGlossaryClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg glass-effect hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors"
                  title="Citations & References"
                >
                  <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.button>

                {/* Dark Mode Toggle */}
                <motion.button
                  onClick={onDarkModeToggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg glass-effect hover:bg-accent-50 dark:hover:bg-accent-900/20 transition-colors"
                  title="Toggle Dark Mode"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="glass-effect rounded-2xl p-4 shadow-booth">
          <div className="grid grid-cols-3 gap-2 text-xs">
            {sections.slice(0, 6).map((section) => (
              <motion.button
                key={section.id}
                onClick={() => handleNavClick(section.id)}
                whileTap={{ scale: 0.95 }}
                className={`navigation-item px-2 py-2 rounded-lg text-center ${
                  activeSection === section.id ? 'active' : ''
                }`}
              >
                <div className="truncate">{section.title}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation; 