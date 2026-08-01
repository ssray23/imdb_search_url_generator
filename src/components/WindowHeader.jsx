import React from 'react';
import { Sun, Moon, Sparkles, RotateCcw } from 'lucide-react';

export default function WindowHeader({ theme, toggleTheme, onReset }) {
  return (
    <header className="mac-header">
      <div className="window-title">
        <Sparkles size={15} style={{ color: '#f59e0b' }} />
        IMDb Search URL Generator
      </div>

      <div className="header-actions">
        <button 
          className="icon-btn" 
          onClick={onReset} 
          title="Reset to Defaults"
        >
          <RotateCcw size={14} />
        </button>
        <button 
          className="icon-btn" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}
