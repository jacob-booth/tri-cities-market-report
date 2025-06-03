import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import Navigation from './components/Navigation';
import SectionCard from './components/SectionCard';
import SearchModal from './components/SearchModal';
import GlossaryDrawer from './components/GlossaryDrawer';
import reportData from './data/report.json';

function App() {
  const [currentSection, setCurrentSection] = useState('executive-summary');
  const [searchOpen, setSearchOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
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
      const sections = reportData.sections.map(section => section.id);
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 120; // Account for fixed navigation
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleCitationClick = () => {
    setGlossaryOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-navy-900 dark:to-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <Navigation
        sections={reportData.sections as any}
        activeSection={currentSection}
        onNavigate={handleSectionClick}
        onSearchClick={() => setSearchOpen(true)}
        onGlossaryClick={() => setGlossaryOpen(true)}
        darkMode={darkMode}
        onDarkModeToggle={toggleDarkMode}
      />

      {/* Hero Section */}
      <HeroSection data={reportData.keyMetrics} />

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        <div className="max-w-6xl mx-auto px-6 pb-20">
          {/* BOOTH Report Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="./booth-logo.png" 
                  alt="BOOTH" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-left">
                <h1 className="font-cinzel text-2xl font-bold text-booth-gradient">
                  {reportData.metadata.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 font-poppins">
                  {reportData.metadata.subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-poppins">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                {reportData.metadata.author}
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                {reportData.metadata.date}
              </span>
            </div>
          </motion.div>

          {/* Section Content */}
          <div className="space-y-16">
            {reportData.sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <SectionCard section={section as any} onCitationClick={handleCitationClick} />
              </motion.div>
            ))}
          </div>

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
        </div>
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        sections={reportData.sections}
        onSectionSelect={handleSectionClick}
      />

      {/* Glossary Drawer */}
      <GlossaryDrawer
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        citations={reportData.citations}
      />
    </div>
  );
}

export default App; 