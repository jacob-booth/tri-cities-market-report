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
export const useTheme = () => useAppStore((state) => ({
  darkMode: state.darkMode,
  setDarkMode: state.setDarkMode,
  toggleDarkMode: state.toggleDarkMode,
}));

export const useNavigation = () => useAppStore((state) => ({
  currentSection: state.currentSection,
  setCurrentSection: state.setCurrentSection,
}));

export const useModals = () => useAppStore((state) => ({
  showSearch: state.showSearch,
  setShowSearch: state.setShowSearch,
  showGlossary: state.showGlossary,
  setShowGlossary: state.setShowGlossary,
}));

export const useFactCheck = () => useAppStore((state) => ({
  factCheckResults: state.factCheckResults,
  setFactCheckResult: state.setFactCheckResult,
  clearFactCheckResults: state.clearFactCheckResults,
}));

export const useCitations = () => useAppStore((state) => ({
  selectedCitations: state.selectedCitations,
  addCitation: state.addCitation,
  removeCitation: state.removeCitation,
  clearCitations: state.clearCitations,
}));

export const useAppStatus = () => useAppStore((state) => ({
  isLoading: state.isLoading,
  setLoading: state.setLoading,
  error: state.error,
  setError: state.setError,
  clearError: state.clearError,
}));
