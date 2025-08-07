import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navigation from '../Navigation';
import type { Section } from '../../utils/validateReport';

// Mock the Zustand store
vi.mock('../../store/useAppStore', () => ({
  useTheme: () => ({
    darkMode: false,
    toggleDarkMode: vi.fn(),
  }),
}));

const mockSections: Section[] = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    tldr: 'Overview of the market report',
    content: ['Content here'],
  },
  {
    id: 'demographics',
    title: 'Demographics',
    tldr: 'Population and demographic data',
    content: ['Content here'],
  },
];

describe('Navigation', () => {
  const defaultProps = {
    sections: mockSections,
    activeSection: '',
    onNavigate: vi.fn(),
    onSearchClick: vi.fn(),
    onGlossaryClick: vi.fn(),
  };

  it('renders navigation with all sections', () => {
    render(<Navigation {...defaultProps} />);
    
    expect(screen.getByText('BOOTH')).toBeInTheDocument();
    expect(screen.getByText('Executive Summary')).toBeInTheDocument();
    expect(screen.getByText('Demographics')).toBeInTheDocument();
  });

  it('calls onNavigate when section is clicked', () => {
    render(<Navigation {...defaultProps} />);
    
    const executiveSummaryButton = screen.getByText('Executive Summary');
    fireEvent.click(executiveSummaryButton);
    
    expect(defaultProps.onNavigate).toHaveBeenCalledWith('executive-summary');
  });

  it('calls onSearchClick when search button is clicked', () => {
    render(<Navigation {...defaultProps} />);
    
    const searchButton = screen.getByLabelText('Search report content');
    fireEvent.click(searchButton);
    
    expect(defaultProps.onSearchClick).toHaveBeenCalled();
  });

  it('calls onGlossaryClick when glossary button is clicked', () => {
    render(<Navigation {...defaultProps} />);
    
    const glossaryButton = screen.getByLabelText('Open glossary and citations');
    fireEvent.click(glossaryButton);
    
    expect(defaultProps.onGlossaryClick).toHaveBeenCalled();
  });

  it('shows active section with correct styling', () => {
    render(<Navigation {...defaultProps} activeSection="executive-summary" />);
    
    const activeButton = screen.getByText('Executive Summary');
    expect(activeButton).toHaveClass('text-primary-600');
  });

  it('renders progress bar', () => {
    render(<Navigation {...defaultProps} />);
    
    const progressBar = screen.getByRole('progressbar', { hidden: true });
    expect(progressBar).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Navigation {...defaultProps} />);
    
    expect(screen.getByLabelText('Search report content')).toBeInTheDocument();
    expect(screen.getByLabelText('Open glossary and citations')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });
});
