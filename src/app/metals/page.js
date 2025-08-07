'use client';
import { useState, useEffect } from 'react';
import { fetchJSON } from '@/lib/api';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('@/components/LineChart'), { ssr: false });

export default function MetalsPage() {
  const [metals, setMetals] = useState([]);
  const [ownedMetals, setOwnedMetals] = useState([]);
  const [selectedBuyMetal, setSelectedBuyMetal] = useState(null);
  const [selectedSellMetal, setSelectedSellMetal] = useState(null);
  const [buyUnits, setBuyUnits] = useState("");
  const [sellUnits, setSellUnits] = useState("");
  const [mode, setMode] = useState("buy");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMetals() {
      try {
        setLoading(true);
        const data = await fetchJSON("/api/metals/search");
        setMetals(data || []);
      } catch (err) {
        console.error("Error loading metals:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetals();
  }, []);

  useEffect(() => {
    fetchOwned();
  }, []);

  async function fetchOwned() {
    try {
      const data = await fetchJSON("/api/metals/owned");
      console.log("Owned metals data:", data);
      setOwnedMetals(data || []);
    } catch (err) {
      console.error("Error loading owned metals:", err);
    }
  }

  const handleBuy = async (name, symbol, price, units) => {
    if (units <= 0) return alert("Select metal and units");
    
    try {
      setLoading(true);
      const metalsData = await fetchJSON("/api/metals/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metalName: name,
          symbol: symbol,
          units: units,
          price: price,
        })
      });
      
      if (metalsData) {
        alert("Metal purchased successfully");
        setOwnedMetals(metalsData);
        setBuyUnits(0);
      } else {
        alert(metalsData.error || "Error buying metal");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing purchase");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (name, symbol, price, units, ownedUnits) => {
    if (ownedUnits < units || units <= 0) {
      return alert("Not enough units to sell");
    }
    
    try {
      setLoading(true);
      const data = await fetchJSON("/api/metals/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metalName: name,
          symbol: symbol,
          units: units,
          price: price,
        })
      });
      
      alert("Metal sold successfully");
      await fetchOwned();
      setSellUnits("");
      setSelectedSellMetal(null);
    } catch (err) {
      console.error(err);
      alert("Error processing sale");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Precious Metals Investment
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Invest in gold, silver, platinum, and other precious metals for portfolio diversification and inflation protection
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <button 
          className={`tab ${mode === 'buy' ? 'active' : ''}`}
          onClick={() => setMode('buy')}
        >
          🥇 Buy Metals
        </button>
        <button 
          className={`tab ${mode === 'sell' ? 'active' : ''}`}
          onClick={() => setMode('sell')}
        >
          💰 Sell Metals
        </button>
      </div>

      {/* Buy Tab */}
      {mode === 'buy' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.25rem' }}>
            Available Precious Metals
          </h3>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Loading metals...
            </div>
          ) : metals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🥇</div>
              <p>No metals available at the moment.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: '2rem' }}>
              {metals.map(m => (
                <div
                  key={m.symbol}
                  onClick={() => setSelectedBuyMetal(m)}
                  className="portfolio-card"
                  style={{
                    cursor: "pointer",
                    minWidth: '250px',
                    border: selectedBuyMetal?.symbol === m.symbol ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                      {m.name.toLowerCase().includes('gold') ? '🥇' : 
                       m.name.toLowerCase().includes('silver') ? '🥈' : 
                       m.name.toLowerCase().includes('platinum') ? '🥉' : '⚪'}
                    </div>
                    <h4 style={{ marginBottom: '0.5rem', color: '#1e293b', fontWeight: '600' }}>
                      <strong>{m.name}</strong>
                    </h4>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      ({m.symbol})
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>
                      {formatCurrency(m.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Purchase Section */}
          {selectedBuyMetal && (
            <div className="metric-card" style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>
                Buy {selectedBuyMetal.name}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                    Units to Buy
                  </label>
                  <input
                    type="number"
                    placeholder="Units"
                    value={buyUnits}
                    onChange={e => setBuyUnits(e.target.value)}
                    className="input"
                    min="1"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                    Price per Unit
                  </label>
                  <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#1e293b', fontWeight: '600' }}>
                    {formatCurrency(selectedBuyMetal.price)}
                  </div>
                </div>
                {buyUnits > 0 && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                      Total Cost
                    </label>
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#1e293b', fontWeight: '600' }}>
                      {formatCurrency(selectedBuyMetal.price * buyUnits)}
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="btn btn-success" 
                onClick={() => handleBuy(selectedBuyMetal.name, selectedBuyMetal.symbol, selectedBuyMetal.price, buyUnits)}
                disabled={loading || !buyUnits || buyUnits <= 0}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  'Buy Metal'
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sell Tab */}
      {mode === 'sell' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.25rem' }}>
            Your Metals Portfolio
          </h3>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Loading your metals portfolio...
            </div>
          ) : ownedMetals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🥇</div>
              <h4 style={{ marginBottom: '0.5rem' }}>No metals in your portfolio</h4>
              <p>Start by buying some precious metals in the Buy tab</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: '2rem' }}>
              {ownedMetals.map(m => (
                <div
                  key={m.metal_symbol}
                  onClick={() => setSelectedSellMetal(m)}
                  className="portfolio-card"
                  style={{
                    cursor: "pointer",
                    minWidth: '250px',
                    border: selectedSellMetal?.metal_symbol === m.metal_symbol ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                      {m.metal_name.toLowerCase().includes('gold') ? '🥇' : 
                       m.metal_name.toLowerCase().includes('silver') ? '🥈' : 
                       m.metal_name.toLowerCase().includes('platinum') ? '🥉' : '⚪'}
                    </div>
                    <h4 style={{ marginBottom: '0.5rem', color: '#1e293b', fontWeight: '600' }}>
                      <strong>{m.metal_name}</strong>
                    </h4>
                    <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      ({m.metal_symbol})
                    </div>
                    <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '0.5rem' }}>
                      Units: {m.units_remaining}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>
                      {formatCurrency(m.current_price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sell Section */}
          {selectedSellMetal && (
            <div className="metric-card" style={{ marginTop: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>
                Sell {selectedSellMetal.metal_name}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                    Units to Sell
                  </label>
                  <input
                    type="number"
                    placeholder="Units to Sell"
                    value={sellUnits}
                    onChange={e => setSellUnits(e.target.value)}
                    className="input"
                    min="1"
                    max={selectedSellMetal.units_remaining}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                    Price per Unit
                  </label>
                  <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#1e293b', fontWeight: '600' }}>
                    {formatCurrency(selectedSellMetal.current_price)}
                  </div>
                </div>
                {sellUnits > 0 && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                      Total Value
                    </label>
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: '#1e293b', fontWeight: '600' }}>
                      {formatCurrency(selectedSellMetal.current_price * sellUnits)}
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="btn btn-danger" 
                onClick={() => handleSell(selectedSellMetal.metal_name, selectedSellMetal.metal_symbol, selectedSellMetal.current_price, sellUnits, selectedSellMetal.units_remaining)}
                disabled={loading || !sellUnits || sellUnits <= 0 || sellUnits > selectedSellMetal.units_remaining}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  'Sell Metal'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
