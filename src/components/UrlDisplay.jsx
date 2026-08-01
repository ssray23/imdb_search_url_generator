import React from 'react';
import { Copy, ExternalLink, Bookmark, Check, Play, Tv } from 'lucide-react';

export default function UrlDisplay({ 
  generatedUrl, 
  justWatchUrl, 
  copied, 
  onCopy, 
  onSaveSearch 
}) {
  return (
    <div className="url-output-card">
      {/* Section Title (Single Line) */}
      <div className="card-title" style={{ whiteSpace: 'nowrap' }}>
        <Play size={14} style={{ color: 'var(--accent-primary)' }} /> Live Generated Search URL
      </div>

      {/* Action Buttons Bar on Single Line (Never Wraps) */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap', width: '100%' }}>
        <button 
          type="button"
          className="preset-btn" 
          onClick={onCopy}
          title="Copy URL to clipboard"
          style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            padding: '7px 10px', 
            whiteSpace: 'nowrap' 
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy URL'}
        </button>

        <button 
          type="button"
          className="preset-btn" 
          onClick={onSaveSearch}
          title="Save to History"
          style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px', 
            padding: '7px 10px', 
            whiteSpace: 'nowrap' 
          }}
        >
          <Bookmark size={13} /> Save
        </button>
      </div>

      {/* Code URL Box (Clickable link directly) */}
      <a 
        href={generatedUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="url-code-wrapper"
        style={{ textDecoration: 'none', display: 'block', cursor: 'pointer' }}
        title="Click to open this search in IMDb in a new tab"
      >
        <span className="url-highlight-host">https://www.imdb.com/search/title/?</span>
        {generatedUrl.replace('https://www.imdb.com/search/title/?', '').split('&').map((param, i) => {
          const [key, val] = param.split('=');
          return (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--text-muted)' }}>&</span>}
              <span className="url-highlight-param">{key}</span>
              <span style={{ color: 'var(--text-muted)' }}>=</span>
              <span className={val?.includes('!') ? 'url-highlight-neg' : 'url-highlight-val'}>
                {val}
              </span>
            </React.Fragment>
          );
        })}
      </a>

      {/* Main Full-Width 1-Click Open Blue Button */}
      <a 
        href={generatedUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn-primary" 
        style={{ 
          textDecoration: 'none', 
          width: '100%', 
          padding: '13px 18px', 
          fontSize: '14.5px' 
        }}
      >
        <ExternalLink size={17} /> Open Search in IMDb (New Tab)
      </a>
    </div>
  );
}
