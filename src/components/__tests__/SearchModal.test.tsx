import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchModal from '../SearchModal';
import type { Section } from '../../utils/validateReport';

const mockSections: Section[] = [
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    tldr: 'Overview of the market report with key insights',
    content: ['The Tri-Cities region shows strong growth'],
  },
  {
    id: 'demographics',
    title: 'Demographics',
    tldr: 'Population and demographic data analysis',
    content: ['Johnson City has 74,814 residents'],
  },
];

describe('SearchModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    sections: mockSections,
    onSectionSelect: vi.fn(),
  };

  it('renders search modal when open', () => {
    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByText('Search Report')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search sections, content, and key findings...')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SearchModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Search Report')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<SearchModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close search modal');
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<SearchModal {...defaultProps} />);
    
    const backdrop = screen.getByRole('dialog').parentElement;
    fireEvent.click(backdrop!);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('filters sections based on search query', async () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search sections, content, and key findings...');
    fireEvent.change(searchInput, { target: { value: 'Executive' } });
    
    await waitFor(() => {
      expect(screen.getByText('Executive Summary')).toBeInTheDocument();
      expect(screen.queryByText('Demographics')).not.toBeInTheDocument();
    });
  });

  it('shows no results message when no matches found', async () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search sections, content, and key findings...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('No results found for "nonexistent"')).toBeInTheDocument();
    });
  });

  it('calls onSectionSelect when result is clicked', async () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search sections, content, and key findings...');
    fireEvent.change(searchInput, { target: { value: 'Executive' } });
    
    await waitFor(() => {
      const resultButton = screen.getByText('Executive Summary');
      fireEvent.click(resultButton);
      
      expect(defaultProps.onSectionSelect).toHaveBeenCalledWith('executive-summary');
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  it('handles keyboard navigation', async () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search sections, content, and key findings...');
    fireEvent.change(searchInput, { target: { value: 'Executive' } });
    
    await waitFor(() => {
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
      fireEvent.keyDown(searchInput, { key: 'Enter' });
      
      expect(defaultProps.onSectionSelect).toHaveBeenCalledWith('executive-summary');
    });
  });

  it('closes modal on Escape key', () => {
    render(<SearchModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search sections, content, and key findings...');
    fireEvent.keyDown(searchInput, { key: 'Escape' });
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<SearchModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByLabelText('Search report content')).toBeInTheDocument();
    expect(screen.getByLabelText('Close search modal')).toBeInTheDocument();
  });
});
