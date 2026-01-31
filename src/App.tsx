import { useEffect, Suspense, lazy, useState } from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import SearchModal from './components/SearchModal';
import GlossaryDrawer from './components/GlossaryDrawer';
import DynamicBackground from './components/DynamicBackground';
import { useTheme, useNavigation, useModals } from './store/useAppStore';
import { validateAndLoadReportData } from './utils/validateReport';
import type { ReportData } from './utils/validateReport';

// Lazy load heavy components for better performance
const HeroSection = lazy(() => import('./components/HeroSection'));
const SectionCard = lazy(() => import('./components/SectionCard'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
  </div>
);

function App() {
  const { darkMode, setDarkMode } = useTheme();
  const { currentSection, setCurrentSection } = useNavigation();
  const { showSearch, setShowSearch, showGlossary, setShowGlossary } = useModals();

  // Initialize theme from system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, [setDarkMode]);

  // Update document class when dark mode changes
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
  }, [setCurrentSection]);

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

  // Load and validate report data
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await validateAndLoadReportData();
        setReportData(data);
      } catch (error) {
        console.error('Failed to load report data:', error);
        setError('Failed to load report data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Data Loading Error</h2>
            <p className="text-gray-600">{error || 'Failed to load report data. Please refresh the page.'}</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative">
        {/* Dynamic Background */}
        <DynamicBackground />
        
        {/* Navigation */}
        <Navigation
          sections={reportData.sections}
          activeSection={currentSection}
          onNavigate={handleSectionClick}
          onSearchClick={() => setShowSearch(true)}
          onGlossaryClick={() => setShowGlossary(true)}
        />

        {/* Hero Section */}
        <Suspense fallback={<LoadingFallback />}>
          <HeroSection data={reportData.keyMetrics} />
        </Suspense>

        {/* Main Content */}
        <main className="relative z-10">
          <Suspense fallback={<LoadingFallback />}>
            {reportData.sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                onCitationClick={() => {}}
              />
            ))}
          </Suspense>
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
          sections={reportData.sections}
          onSectionSelect={handleSectionClick}
        />

        {/* Glossary Drawer */}
        <GlossaryDrawer
          isOpen={showGlossary}
          onClose={() => setShowGlossary(false)}
          citations={reportData.citations}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App; 