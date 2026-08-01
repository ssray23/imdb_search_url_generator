import React, { useState } from 'react';
import { 
  Globe, 
  Film, 
  Tag, 
  Calendar, 
  ArrowUpDown, 
  Tv, 
  Plus,
  Check,
  ShieldAlert 
} from 'lucide-react';

const POPULAR_GENRES = [
  'Mystery',
  'Action',
  'Drama',
  'Comedy',
  'Thriller',
  'Sci-Fi',
  'Horror',
  'Romance',
  'Crime',
  'Adventure',
  'Fantasy',
  'Animation',
  'Family',
  'History',
  'Biography',
  'Musical',
  'Sport',
  'War',
  'Film-Noir'
];

export default function SearchForm({ config, onChange, onApplyPresetYear }) {
  const [customGenreInput, setCustomGenreInput] = useState('');

  // Toggle selection of a genre
  const toggleGenre = (genre) => {
    const lower = genre.toLowerCase().trim();
    if (!lower) return;

    let updated = [...config.selectedGenres];
    if (updated.includes(lower)) {
      updated = updated.filter(g => g !== lower);
    } else {
      updated.push(lower);
    }
    onChange({ selectedGenres: updated });
  };

  // Add custom user genre input
  const handleAddCustomGenre = (e) => {
    e.preventDefault();
    if (!customGenreInput.trim()) return;
    toggleGenre(customGenreInput.trim());
    setCustomGenreInput('');
  };

  // Clear all selected genres
  const clearAllGenres = () => {
    onChange({ selectedGenres: [] });
  };

  return (
    <div className="search-form-container">
      {/* 1. Language Preference */}
      <div className="mac-card">
        <div className="card-title">
          <Globe size={14} /> Primary Language
        </div>
        <div className="form-group">
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-option ${config.langMode === 'hi' ? 'active' : ''}`}
              onClick={() => onChange({ langMode: 'hi' })}
            >
              🇮🇳 Hindi
            </button>
            <button
              type="button"
              className={`segmented-option ${config.langMode === 'en' ? 'active' : ''}`}
              onClick={() => onChange({ langMode: 'en' })}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              className={`segmented-option ${config.langMode === 'bn' ? 'active' : ''}`}
              onClick={() => onChange({ langMode: 'bn' })}
            >
              🇮🇳 Bengali
            </button>
            <button
              type="button"
              className={`segmented-option ${config.langMode === 'all' ? 'active' : ''}`}
              onClick={() => onChange({ langMode: 'all' })}
            >
              🌐 All Three
            </button>
          </div>
          <span className="sublabel">
            Restricted to your preferred languages: Hindi, English, and Bengali
          </span>
        </div>
      </div>

      {/* 2. Format Selection */}
      <div className="mac-card">
        <div className="card-title">
          <Film size={14} /> Title Format & Exclusions
        </div>
        <div className="form-group">
          <label className="form-label">Format Type:</label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-option ${config.titleType === 'feature' ? 'active' : ''}`}
              onClick={() => onChange({ titleType: 'feature' })}
            >
              🎬 Feature Film
            </button>
            <button
              type="button"
              className={`segmented-option ${config.titleType === 'tv_series' ? 'active' : ''}`}
              onClick={() => onChange({ titleType: 'tv_series' })}
            >
              📺 Series
            </button>
            <button
              type="button"
              className={`segmented-option ${config.titleType === 'feature,tv_series' ? 'active' : ''}`}
              onClick={() => onChange({ titleType: 'feature,tv_series' })}
            >
              🍿 Both
            </button>
          </div>
          <span className="sublabel">
            Short films and documentaries are automatically excluded
          </span>
        </div>
      </div>

      {/* 3. Enhanced Genre Selection */}
      <div className="mac-card">
        <div className="card-title" style={{ justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Tag size={14} /> Genre Selection
          </span>
          {config.selectedGenres.length > 0 && (
            <button 
              type="button"
              className="preset-btn" 
              onClick={clearAllGenres} 
              style={{ color: '#ef4444', fontSize: '11px' }}
            >
              Clear Selected ({config.selectedGenres.length})
            </button>
          )}
        </div>

        <div className="form-group">
          {/* Custom Genre Input Form */}
          <form onSubmit={handleAddCustomGenre} className="input-row" style={{ marginBottom: '4px' }}>
            <input
              type="text"
              className="mac-input"
              placeholder="Add custom genre tag or keyword (e.g. suspense, superhero)..."
              value={customGenreInput}
              onChange={(e) => setCustomGenreInput(e.target.value)}
            />
            <button type="submit" className="preset-btn" style={{ padding: '8px 12px', flexShrink: 0 }}>
              <Plus size={12} /> Add
            </button>
          </form>

          {/* Interactive Genre Chips Grid */}
          <div className="chips-grid">
            {POPULAR_GENRES.map((g) => {
              const lower = g.toLowerCase();
              const isSelected = config.selectedGenres.includes(lower);
              return (
                <button
                  key={g}
                  type="button"
                  className={`genre-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => toggleGenre(g)}
                >
                  {isSelected ? (
                    <Check size={12} strokeWidth={2.8} />
                  ) : (
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>+</span>
                  )}
                  <span>{g}</span>
                </button>
              );
            })}

            {/* Render any additional custom genres user added */}
            {config.selectedGenres
              .filter(g => !POPULAR_GENRES.map(p => p.toLowerCase()).includes(g))
              .map((customG) => (
                <button
                  key={customG}
                  type="button"
                  className="genre-chip active"
                  onClick={() => toggleGenre(customG)}
                >
                  <Check size={12} strokeWidth={2.8} />
                  <span>{customG}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* 4. Release Year Filter */}
      <div className="mac-card">
        <div className="card-title">
          <Calendar size={14} /> Release Year Range
        </div>
        <div className="form-group">
          <div className="input-row">
            <input
              type="number"
              className="mac-input"
              placeholder="Year From (e.g. 2015)"
              value={config.yearFrom}
              onChange={(e) => onChange({ yearFrom: e.target.value })}
              min="1920"
              max="2030"
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>to</span>
            <input
              type="number"
              className="mac-input"
              placeholder="Year To (e.g. 2026)"
              value={config.yearTo}
              onChange={(e) => onChange({ yearTo: e.target.value })}
              min="1920"
              max="2030"
            />
          </div>
          
          <div className="preset-pills">
            <button type="button" className="preset-btn" onClick={() => onApplyPresetYear(2020, 2026)}>2020s</button>
            <button type="button" className="preset-btn" onClick={() => onApplyPresetYear(2010, 2019)}>2010s</button>
            <button type="button" className="preset-btn" onClick={() => onApplyPresetYear(2000, 2009)}>2000s</button>
            <button type="button" className="preset-btn" onClick={() => onApplyPresetYear(2021, 2026)}>Last 5 Yrs</button>
            <button type="button" className="preset-btn" onClick={() => onApplyPresetYear('', '')}>Clear</button>
          </div>
        </div>
      </div>

      {/* 5. Sort By Option */}
      <div className="mac-card">
        <div className="card-title">
          <ArrowUpDown size={14} /> Default Sort Order
        </div>
        <div className="form-group">
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-option ${config.sortBy === 'num_votes,desc' ? 'active' : ''}`}
              onClick={() => onChange({ sortBy: 'num_votes,desc' })}
            >
              🔥 Popularity
            </button>
            <button
              type="button"
              className={`segmented-option ${config.sortBy === 'release_date,desc' ? 'active' : ''}`}
              onClick={() => onChange({ sortBy: 'release_date,desc' })}
            >
              📅 Release Year
            </button>
            <button
              type="button"
              className={`segmented-option ${config.sortBy === 'user_rating,desc' ? 'active' : ''}`}
              onClick={() => onChange({ sortBy: 'user_rating,desc' })}
            >
              ⭐ Rating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
