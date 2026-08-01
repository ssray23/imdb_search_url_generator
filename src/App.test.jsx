import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock matchMedia if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('IMDb Search URL Generator App', () => {
  it('renders with default Hindi, Feature Film, Mystery', () => {
    render(<App />);
    const link = screen.getByRole('link', { name: /open search in imdb/i });
    const url = link.getAttribute('href');
    
    // Check default params
    expect(url).toContain('title_type=feature');
    expect(url).toContain('genres=mystery');
    expect(url).toContain('primary_language=hi');
    expect(url).toContain('sort=num_votes,desc');
  });

  it('handles multiple online availability regions properly', async () => {
    render(<App />);
    
    // Select US Prime (Rent or Buy) -> US/today/Amazon/paid
    const usPrimeBtn = screen.getByText(/US Prime \(Rent or Buy\)/);
    fireEvent.click(usPrimeBtn);
    
    // Select UK Prime (Rent or Buy) -> GB/today/Amazon/paid
    const ukPrimeBtn = screen.getByText(/UK Prime \(Rent or Buy\)/);
    fireEvent.click(ukPrimeBtn);
    
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /open search in imdb/i });
      const url = link.getAttribute('href');
      
      // Should preserve literal commas, no %2C
      expect(url).toContain('online_availability=US%2Ftoday%2FAmazon%2Fpaid,GB%2Ftoday%2FAmazon%2Fpaid');
    });
  });

  it('correctly maps custom keywords versus official genres', async () => {
    render(<App />);
    
    const customInput = screen.getByPlaceholderText(/Add custom genre tag/i);
    const addButton = screen.getByRole('button', { name: /add/i });
    
    // Add custom keyword
    fireEvent.change(customInput, { target: { value: 'superhero' } });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /open search in imdb/i });
      const url = link.getAttribute('href');
      
      // 'mystery' is official, 'superhero' is custom
      expect(url).toContain('genres=mystery');
      expect(url).toContain('keywords=superhero');
    });
  });
  
  it('generates the correct title format (tv_series)', async () => {
    render(<App />);
    
    const seriesBtn = screen.getByRole('button', { name: /📺 Series/i });
    fireEvent.click(seriesBtn);
    
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /open search in imdb/i });
      const url = link.getAttribute('href');
      
      expect(url).toContain('title_type=tv_series');
    });
  });
});
