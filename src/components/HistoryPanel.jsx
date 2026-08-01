import React from 'react';
import { History, Trash2, ArrowUpRight } from 'lucide-react';

const PRESET_QUICK_SEARCHES = [
  {
    icon: '🔍',
    name: 'Hindi Mystery Feature Hits',
    config: {
      langMode: 'hi',
      selectedGenres: ['mystery'],
      yearFrom: '',
      yearTo: '',
      sortBy: 'num_votes,desc',
      primeIndia: false,
      primeUK: false
    }
  },
  {
    icon: '🇬🇧',
    name: 'Popular English Thrillers 2020+',
    config: {
      langMode: 'en',
      selectedGenres: ['thriller'],
      yearFrom: '2020',
      yearTo: '2026',
      sortBy: 'num_votes,desc',
      primeIndia: false,
      primeUK: false
    }
  },
  {
    icon: '🇮🇳',
    name: 'Bengali Drama & Mystery Classics',
    config: {
      langMode: 'bn',
      selectedGenres: ['drama', 'mystery'],
      yearFrom: '2000',
      yearTo: '2024',
      sortBy: 'user_rating,desc',
      primeIndia: false,
      primeUK: false
    }
  },
  {
    icon: '🇮🇳',
    name: 'Amazon Prime Hindi Mystery Movies',
    config: {
      langMode: 'hi',
      selectedGenres: ['mystery'],
      yearFrom: '2015',
      yearTo: '2026',
      sortBy: 'num_votes,desc',
      primeIndia: true,
      primeUK: false
    }
  }
];

export default function HistoryPanel({ history, onSelectConfig, onDeleteItem, onClearHistory }) {
  return (
    <div className="mac-card">
      <div className="card-title" style={{ justifyContent: 'space-between', textAlign: 'left' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <History size={14} /> Quick Presets & History
        </span>
        {history.length > 0 && (
          <button 
            className="preset-btn" 
            onClick={onClearHistory}
            style={{ color: '#ef4444' }}
            title="Clear saved searches"
          >
            <Trash2 size={12} /> Clear
          </button>
        )}
      </div>

      {/* Recommended Presets */}
      <div className="form-group" style={{ textAlign: 'left' }}>
        <span className="sublabel" style={{ fontWeight: 600, textAlign: 'left' }}>Quick Preset Templates:</span>
        <div className="history-list">
          {PRESET_QUICK_SEARCHES.map((item, idx) => (
            <div 
              key={idx} 
              className="history-item"
              onClick={() => onSelectConfig(item.config)}
              style={{ textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' }}>
                <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                  <div className="history-name" style={{ textAlign: 'left' }}>{item.name}</div>
                  <div className="history-sub" style={{ textAlign: 'left' }}>Click to load query parameters</div>
                </div>
              </div>
              <ArrowUpRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      {/* User Saved History */}
      {history.length > 0 && (
        <div className="form-group" style={{ marginTop: '8px', textAlign: 'left' }}>
          <span className="sublabel" style={{ fontWeight: 600, textAlign: 'left' }}>Saved Searches ({history.length}):</span>
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item" style={{ textAlign: 'left' }}>
                <div 
                  style={{ flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}
                  onClick={() => onSelectConfig(item.config)}
                >
                  <div className="history-name" style={{ textAlign: 'left' }}>{item.name}</div>
                  <div className="history-sub" style={{ textAlign: 'left' }}>Saved on {new Date(item.timestamp).toLocaleDateString()}</div>
                </div>
                <button
                  className="preset-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  style={{ padding: '4px 7px', color: '#ef4444', flexShrink: 0 }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
