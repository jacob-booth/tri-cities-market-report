import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Section } from '../utils/validateReport';

interface AppState {
  // Theme state
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;

  // Navigation state
  currentSection: string;
  setCurrentSection: (section: string) => void;

  // Modal states
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showGlossary: boolean;
  setShowGlossary: (show: boolean) => void;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Fact check state
  factCheckResults: Record<string, any>;
  setFactCheckResult: (id: string, result: any) => void;
  clearFactCheckResults: () => void;

  // Citations state
  selectedCitations: number[];
  addCitation: (id: number) => void;
  removeCitation: (id: number) => void;
  clearCitations: () => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme state
      darkMode: false,
      setDarkMode: (darkMode) => set({ darkMode }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Navigation state
      currentSection: '',
      setCurrentSection: (currentSection) => set({ currentSection }),

      // Modal states
      showSearch: false,
      setShowSearch: (showSearch) => set({ showSearch }),
      showGlossary: false,
      setShowGlossary: (showGlossary) => set({ showGlossary }),

      // Search state
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      // Fact check state
      factCheckResults: {},
      setFactCheckResult: (id, result) =>
        set((state) => ({
          factCheckResults: { ...state.factCheckResults, [id]: result },
        })),
      clearFactCheckResults: () => set({ factCheckResults: {} }),

      // Citations state
      selectedCitations: [],
      addCitation: (id) =>
        set((state) => ({
          selectedCitations: [...state.selectedCitations, id],
        })),
      removeCitation: (id) =>
        set((state) => ({
          selectedCitations: state.selectedCitations.filter((citationId) => citationId !== id),
        })),
      clearCitations: () => set({ selectedCitations: [] }),

      // Loading states
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),

      // Error state
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'tri-cities-app-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        factCheckResults: state.factCheckResults,
        selectedCitations: state.selectedCitations,
      }),
    }
  )
);

// Selector hooks for better performance
export const useTheme = () => {
  const darkMode = useAppStore((state) => state.darkMode);
  const setDarkMode = useAppStore((state) => state.setDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  return { darkMode, setDarkMode, toggleDarkMode };
};

export const useNavigation = () => {
  const currentSection = useAppStore((state) => state.currentSection);
  const setCurrentSection = useAppStore((state) => state.setCurrentSection);
  return { currentSection, setCurrentSection };
};

export const useModals = () => {
  const showSearch = useAppStore((state) => state.showSearch);
  const setShowSearch = useAppStore((state) => state.setShowSearch);
  const showGlossary = useAppStore((state) => state.showGlossary);
  const setShowGlossary = useAppStore((state) => state.setShowGlossary);
  return { showSearch, setShowSearch, showGlossary, setShowGlossary };
};

export const useFactCheck = () => {
  const factCheckResults = useAppStore((state) => state.factCheckResults);
  const setFactCheckResult = useAppStore((state) => state.setFactCheckResult);
  const clearFactCheckResults = useAppStore((state) => state.clearFactCheckResults);
  return { factCheckResults, setFactCheckResult, clearFactCheckResults };
};

export const useCitations = () => {
  const selectedCitations = useAppStore((state) => state.selectedCitations);
  const addCitation = useAppStore((state) => state.addCitation);
  const removeCitation = useAppStore((state) => state.removeCitation);
  const clearCitations = useAppStore((state) => state.clearCitations);
  return { selectedCitations, addCitation, removeCitation, clearCitations };
};

export const useAppStatus = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const setLoading = useAppStore((state) => state.setLoading);
  const error = useAppStore((state) => state.error);
  const setError = useAppStore((state) => state.setError);
  const clearError = useAppStore((state) => state.clearError);
  return { isLoading, setLoading, error, setError, clearError };
};
