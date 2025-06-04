import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import Navigation from './components/Navigation';
import SectionCard from './components/SectionCard';
import SearchModal from './components/SearchModal';
import GlossaryDrawer from './components/GlossaryDrawer';
import DynamicBackground from './components/DynamicBackground';
import reportData from './data/report.json';
import type { Section } from './types/report';

function App() {
  const [currentSection, setCurrentSection] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Check system preference
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Update document class and localStorage when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = section as HTMLElement;
        const top = element.offsetTop;
        const height = element.offsetHeight;

        if (scrollPosition >= top && scrollPosition < top + height) {
          setCurrentSection(element.dataset.section || '');
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial section

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 80;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen relative">
      {/* Dynamic Background */}
      <DynamicBackground />
      
      {/* Navigation */}
      <Navigation
        sections={reportData.sections as Section[]}
        activeSection={currentSection}
        onNavigate={handleSectionClick}
        onSearchClick={() => setShowSearch(true)}
        onGlossaryClick={() => setShowGlossary(true)}
        darkMode={darkMode}
        onDarkModeToggle={toggleDarkMode}
      />

      {/* Hero Section */}
      <HeroSection 
        data={reportData.keyMetrics as any}
      />

      {/* Main Content */}
      <main className="relative z-10">
        {(reportData.sections as Section[]).map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onCitationClick={() => {}}
          />
        ))}
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-24 pt-12 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="./booth-logo.png" 
                alt="BOOTH" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-cinzel text-xl font-semibold text-booth-gradient">
              BOOTH
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 font-poppins mb-4">
            Comprehensive Market Research & Strategic Analysis
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>© 2025 BOOTH Research Team</span>
            <span>•</span>
            <span>Tri-Cities Regional Analysis</span>
            <span>•</span>
            <span>Tennessee Real Estate Market</span>
          </div>
        </div>
      </motion.footer>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        sections={reportData.sections as Section[]}
        onSectionSelect={handleSectionClick}
      />

      {/* Glossary Drawer */}
      <GlossaryDrawer
        isOpen={showGlossary}
        onClose={() => setShowGlossary(false)}
        citations={[]}
      />
    </div>
  );
}

export default App; 