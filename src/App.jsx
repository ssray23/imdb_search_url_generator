import React, { useState, useEffect, useMemo } from 'react';
import './styles/macos.css';
import WindowHeader from './components/WindowHeader';
import SearchForm from './components/SearchForm';
import UrlDisplay from './components/UrlDisplay';
import HistoryPanel from './components/HistoryPanel';
import Toast from './components/Toast';

const OFFICIAL_IMDB_GENRES = [
  'action', 'adventure', 'animation', 'biography', 'comedy', 'crime', 
  'drama', 'family', 'fantasy', 'film-noir', 'history', 'horror', 
  'music', 'musical', 'mystery', 'romance', 'sci-fi', 'sport', 
  'thriller', 'war', 'western'
];

const DEFAULT_CONFIG = {
  langMode: 'hi', // 'hi', 'en', 'bn', or 'all'
  titleType: 'feature', // 'feature', 'tv_series', or 'feature,tv_series'
  selectedGenres: ['mystery'], // Default mystery
  customKeywords: [], // Custom keywords
  yearFrom: '',
  yearTo: '',
  sortBy: 'num_votes,desc', // Default popularity
  onlineAvailability: [] // Instant watch option
};

export default function App() {
  const [theme, setTheme] = useState('light');
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('imdb_search_history');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      const unique = [];
      const seen = new Set();
      for (const item of parsed) {
        const key = item.url || (item.config ? JSON.stringify(item.config) : item.name);
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      }
      return unique;
    } catch {
      return [];
    }
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Heartbeat to automatically shut down server when browser tab is closed
  useEffect(() => {
    const sendHeartbeat = () => {
      fetch('/__heartbeat').catch(() => {});
    };
    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 2000);
    return () => clearInterval(interval);
  }, []);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('imdb_search_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  // Helper to add toast alert
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Toggle Dark/Light mode
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Form config updater
  const handleConfigChange = (updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Preset year range helper
  const handleApplyPresetYear = (from, to) => {
    setConfig(prev => ({
      ...prev,
      yearFrom: from ? String(from) : '',
      yearTo: to ? String(to) : ''
    }));
    addToast(from ? `Applied Year Filter: ${from} - ${to}` : 'Cleared Year Filters');
  };

  // Reset form to defaults
  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    addToast('Form reset to default settings');
  };

  // Construct IMDb URL dynamically
  const generatedUrl = useMemo(() => {
    const params = new URLSearchParams();

    // 1. title_type is feature, tv_series, or feature,tv_series
    params.set('title_type', config.titleType || 'feature');

    // 2. Separate official IMDb genres from custom plot keywords (like suspense, superhero)
    const officialSelected = [];
    const extraKeywords = [...(config.customKeywords || [])];

    (config.selectedGenres || []).forEach(g => {
      const lower = g.toLowerCase().trim();
      if (OFFICIAL_IMDB_GENRES.includes(lower)) {
        officialSelected.push(lower);
      } else {
        // IMDb treats terms like 'suspense' or 'superhero' as keywords= parameter!
        extraKeywords.push(lower);
      }
    });

    // Set official genres parameter (only positive official genres)
    if (officialSelected.length > 0) {
      params.set('genres', Array.from(new Set(officialSelected)).join(','));
    }

    // Set plot keywords parameter if any custom keywords exist
    if (extraKeywords.length > 0) {
      params.set('keywords', Array.from(new Set(extraKeywords)).join(','));
    }

    // 3. Primary Language
    if (config.langMode === 'hi') {
      params.set('primary_language', 'hi');
    } else if (config.langMode === 'en') {
      params.set('primary_language', 'en');
    } else if (config.langMode === 'bn') {
      params.set('primary_language', 'bn');
    } else if (config.langMode === 'all') {
      params.set('primary_language', 'hi,en,bn');
    }

    // 4. Release Date range
    if (config.yearFrom && config.yearTo) {
      params.set('release_date', `${config.yearFrom}-01-01,${config.yearTo}-12-31`);
    } else if (config.yearFrom) {
      params.set('release_date', `${config.yearFrom}-01-01,`);
    } else if (config.yearTo) {
      params.set('release_date', `,${config.yearTo}-12-31`);
    }

    // 5. Sort Order
    params.set('sort', config.sortBy);

    // 6. Online Availability
    const avail = Array.isArray(config.onlineAvailability) 
      ? config.onlineAvailability 
      : (typeof config.onlineAvailability === 'string' && config.onlineAvailability)
        ? [config.onlineAvailability] 
        : [];
        
    if (avail.length > 0) {
      params.set('online_availability', Array.from(new Set(avail)).join(','));
    }

    // IMDb prefers literal commas instead of %2C in their URLs for filters
    return `https://www.imdb.com/search/title/?${params.toString().replace(/%2C/g, ',')}`;
  }, [config]);

  // Copy to Clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      addToast('IMDb Search URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      addToast('Failed to copy URL', 'error');
    }
  };

  // Helper to generate a meaningful, descriptive title for saved searches
  const buildSearchTitle = (cfg) => {
    let lang = 'Hindi';
    if (cfg.langMode === 'en') lang = 'English';
    else if (cfg.langMode === 'bn') lang = 'Bengali';
    else if (cfg.langMode === 'all') lang = 'Hindi, English & Bengali';

    let fmt = 'Films';
    if (cfg.titleType === 'tv_series') fmt = 'Series';
    else if (cfg.titleType === 'feature,tv_series') fmt = 'Films & Series';

    const genres = cfg.selectedGenres && cfg.selectedGenres.length 
      ? cfg.selectedGenres.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')
      : '';

    const keywords = cfg.customKeywords && cfg.customKeywords.length
      ? ` [Keyword: ${cfg.customKeywords.join(', ')}]`
      : '';

    const years = cfg.yearFrom || cfg.yearTo 
      ? ` (${cfg.yearFrom || ''}-${cfg.yearTo || ''})` 
      : '';

    let watchRegion = '';
    const avail = Array.isArray(cfg.onlineAvailability) 
      ? cfg.onlineAvailability 
      : (typeof cfg.onlineAvailability === 'string' && cfg.onlineAvailability)
        ? [cfg.onlineAvailability] 
        : [];

    if (avail.length > 0) {
      const regions = [];
      if (avail.some(o => o.includes('GB'))) regions.push('UK');
      if (avail.some(o => o.includes('US'))) regions.push('US');
      
      if (regions.length > 0) watchRegion = ` [Watch: ${regions.join('+')}]`;
      else watchRegion = ' [Stream]';
    }

    return `${lang} ${genres} ${fmt}${keywords}${years}${watchRegion}`.replace(/\s+/g, ' ').trim();
  };

  // Save current search to local history
  const handleSaveSearch = () => {
    // Check if exact same search URL or config already exists
    const isDuplicate = history.some(item => 
      item.url === generatedUrl || 
      (item.config && JSON.stringify(item.config) === JSON.stringify(config))
    );

    if (isDuplicate) {
      addToast('This search URL is already in your saved history!', 'error');
      return;
    }

    const name = buildSearchTitle(config);

    const newItem = {
      id: Date.now(),
      name,
      url: generatedUrl,
      config,
      timestamp: Date.now()
    };

    setHistory(prev => [newItem, ...prev.slice(0, 19)]);
    addToast(`Saved search "${name}" to history!`);
  };

  const handleDeleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    addToast('Search item removed from history');
  };

  const handleClearHistory = () => {
    setHistory([]);
    addToast('Search history cleared');
  };

  const handleSelectPresetConfig = (newConfig) => {
    setConfig(newConfig);
    addToast('Preset loaded into search form!');
  };

  return (
    <div className="app-viewport">
      <div className="mac-window">
        {/* Header Bar */}
        <WindowHeader 
          theme={theme} 
          toggleTheme={toggleTheme} 
          onReset={handleReset} 
        />

        {/* Window Body */}
        <div className="mac-body">
          <div className="mac-body-grid">
            {/* Form Controls Column */}
            <SearchForm 
              config={config} 
              onChange={handleConfigChange} 
              onApplyPresetYear={handleApplyPresetYear} 
            />

            {/* URL Output & History Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <UrlDisplay 
                generatedUrl={generatedUrl} 
                copied={copied} 
                onCopy={handleCopy} 
                onSaveSearch={handleSaveSearch} 
              />

              <HistoryPanel 
                history={history} 
                onSelectConfig={handleSelectPresetConfig} 
                onDeleteItem={handleDeleteHistoryItem} 
                onClearHistory={handleClearHistory} 
              />
            </div>
          </div>
        </div>
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}
