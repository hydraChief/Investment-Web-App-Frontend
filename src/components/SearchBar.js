'use client';
import { useState, useEffect, useRef } from 'react';

export default function StockSearch(props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
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
        const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
        const data = await res.json();

        if (data.quotes && data.quotes.length > 0) {
          setResults(data.quotes);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error(err);
      }
    }, 500); 

    return () => clearTimeout(debounceRef.current);
  }, [search]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '300px' }}>
      <input
        type="text"
        placeholder="Search for stocks..."
        value={search}
        onChange={(e) => {setSearch(e.target.value); props.setSearch(e.target.value)}}
        style={{ width: '100%', padding: '8px' }}
      />
      {results.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '40px',
          left: 0,
          right: 0,
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          {results.map((r) => (
            <li
              key={r.symbol}
              onClick={() => {
                props.onSelect(r.symbol);
                setSearch(r.symbol);
                setResults([]);
              }}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {r.symbol} — {r.shortname || r.longname || ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
