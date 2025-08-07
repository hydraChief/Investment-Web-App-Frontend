'use client';
import { useState, useEffect, useRef } from 'react';

export default function StockSearch(props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
        const data = await res.json();

        if (data.quotes && data.quotes.length > 0) {
          setResults(data.quotes);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search for stocks (e.g., AAPL, GOOGL, MSFT)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            props.setSearch(e.target.value);
          }}
          className="input"
          style={{ paddingRight: '3rem' }}
        />
        {isLoading && (
          <div style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}>
            <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
          </div>
        )}
        {!isLoading && search && (
          <div style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
            color: '#718096'
          }} onClick={() => {
            setSearch('');
            props.setSearch('');
            setResults([]);
          }}>
            ✕
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '12px',
          marginTop: '0.5rem',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          {results.map((r) => (
            <div
              key={r.symbol}
              onClick={() => {
                props.onSelect(r.symbol);
                setSearch(r.symbol);
                setResults([]);
              }}
              style={{
                padding: '1rem',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>
                    {r.symbol}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    {r.shortname || r.longname || 'N/A'}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#667eea', fontWeight: '500' }}>
                  Stock
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {search && results.length === 0 && !isLoading && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '12px',
          marginTop: '0.5rem',
          padding: '1rem',
          textAlign: 'center',
          color: '#718096',
          zIndex: 1000,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        }}>
          No stocks found for "{search}"
        </div>
      )}
    </div>
  );
}
