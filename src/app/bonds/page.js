'use client';
import { useState, useEffect } from 'react';
import { fetchJSON } from '@/lib/api';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('@/components/LineChart'), { ssr: false });

export default function BondsPage() {
  const [tab, setTab] = useState('buy');
  const [selectedBondType, setSelectedBondType] = useState('treasury bond');
  const [selectedBuyBond, setSelectedBuyBond] = useState({});
  const [selectedSellBond, setSelectedSellBond] = useState({});
  const [ownedBonds, setOwnedBonds] = useState([]);
  const [buyUnits, setBuyUnits] = useState(0);
  const [sellUnits, setSellUnits] = useState(0);
  const [searchedBond, setSearchedBond] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: "US Treasuries", query: "treasury bond" },
    { name: "Corporate Bonds", query: "corporate bond" },
    { name: "Municipal Bonds", query: "municipal bond" },
    { name: "Government Bonds", query: "government bond" },
    { name: "Junk Bonds", query: "high yield bond" },
    { name: "International Bonds", query: "international bond" }
  ];

  useEffect(() => { 
    loadOwnedBonds(); 
  }, []);

  useEffect(() => {
    if (!selectedBondType) return;
    searchBond();
  }, [selectedBondType]);

  async function loadOwnedBonds() {
    try {
      setLoading(true);
      const bonds = await fetchJSON(`/api/bonds/owned`);
      setOwnedBonds(bonds || []);
    } catch (error) {
      console.error("Error loading owned bonds:", error);
    } finally {
      setLoading(false);
    }
  }

  async function searchBond() {
    if (!selectedBondType) return;
    
    try {
      setLoading(true);
      const res = await fetch(`/api/bonds/search?q=${encodeURIComponent(selectedBondType)}`);
      const json = await res.json();
      console.log("Bond search results:", json);
      setSearchedBond(json || []);
    } catch (error) {
      console.error("Error searching bonds:", error);
    } finally {
      setLoading(false);
    }
  }

  async function buyBond(name, symbol, price, buyUnits) {
    if (!buyUnits || buyUnits <= 0) {
      alert("Please enter valid units");
      return;
    }

    try {
      setLoading(true);
      await fetchJSON(`/api/bonds/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name, 
          symbol: symbol, 
          price: price, 
          type: 'buy', 
          units: buyUnits 
        })
      });
      
      loadOwnedBonds();
      setBuyUnits(0);
      alert("Bond purchase successful!");
    } catch (error) {
      console.error("Error buying bond:", error);
      alert("Error processing purchase");
    } finally {
      setLoading(false);
    }
  }

  async function sellBond(name, symbol, ownedUnits, price, sellUnits) {
    if (ownedUnits < sellUnits || sellUnits <= 0) {
      alert("Not enough units to sell");
      return;
    }

    try {
      setLoading(true);
      await fetchJSON(`/api/bonds/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name, 
          symbol: symbol, 
          price: price, 
          type: 'sell', 
          units: sellUnits 
        })
      });
      
      alert("Bond sold successfully!");
      await loadOwnedBonds();
      setSellUnits("");
      setSelectedSellBond(null);
    } catch (error) {
      console.error("Error selling bond:", error);
      alert("Error processing sale");
    } finally {
      setLoading(false);
    }
  }

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
          Bond Investment Management
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          Invest in government and corporate bonds for stable returns and portfolio diversification
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <button 
          className={`tab ${tab === 'buy' ? 'active' : ''}`}
          onClick={() => setTab('buy')}
        >
          🏛️ Buy Bonds
        </button>
        <button 
          className={`tab ${tab === 'sell' ? 'active' : ''}`}
          onClick={() => setTab('sell')}
        >
          💸 Sell Bonds
        </button>
      </div>

      {/* Buy Tab */}
      {tab === 'buy' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.25rem' }}>
            Available Bonds
          </h3>

          {/* Bond Categories */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#475569' }}>Select Bond Category:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {categories.map(cat => (
                <button 
                  key={cat.name} 
                  onClick={() => setSelectedBondType(cat.query)}
                  className={`btn ${selectedBondType === cat.query ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ margin: '0.25rem' }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Bond Selection */}
          {selectedBuyBond && Object.keys(selectedBuyBond).length > 0 && (
            <div className="metric-card" style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#1e293b' }}>Selected Bond: {selectedBuyBond.shortName}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                    Units to Buy
                  </label>
                  <input 
                    type="number" 
                    value={buyUnits} 
                    onChange={e => setBuyUnits(Number(e.target.value))} 
                    placeholder="Enter units"
                    className="input"
                    min="1"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                    Price per Unit
                  </label>
                  <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#1e293b', fontWeight: '600' }}>
                    {formatCurrency(selectedBuyBond.price || 0)}
                  </div>
                </div>
                {buyUnits > 0 && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '500' }}>
                      Total Cost
                    </label>
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: '#1e293b', fontWeight: '600' }}>
                      {formatCurrency((selectedBuyBond.price || 0) * buyUnits)}
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="btn btn-success" 
                onClick={() => buyBond(selectedBuyBond.shortName, selectedBuyBond.symbol, selectedBuyBond.price, buyUnits)}
                disabled={loading || !buyUnits || buyUnits <= 0}
                style={{ width: '100%' }}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  'Buy Bond'
                )}
              </button>
            </div>
          )}

          {/* Bond Listings */}
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', color: '#475569' }}>Available Bonds:</h4>
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                Loading bonds...
              </div>
            ) : searchedBond.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🏛️</div>
                <p>No bonds found for this category. Try selecting a different category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
                {searchedBond.map((bond, index) => (
                  <div 
                    key={bond.symbol} 
                    className="portfolio-card"
                    onClick={() => setSelectedBuyBond(bond)}
                    style={{ 
                      cursor: 'pointer',
                      border: selectedBuyBond?.symbol === bond.symbol ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: '0.5rem', color: '#1e293b', fontSize: '1.1rem', fontWeight: '600' }}>
                          {bond.shortName}
                        </h4>
                        <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                          <span><strong>Symbol:</strong> {bond.symbol}</span>
                          <span><strong>Type:</strong> {bond.type}</span>
                          <span><strong>Price:</strong> {formatCurrency(bond.price)}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>
                          {formatCurrency(bond.price)}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#10b981' }}>
                          Available
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sell Tab */}
      {tab === 'sell' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.25rem' }}>
            Your Bond Portfolio
          </h3>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Loading your bond portfolio...
            </div>
          ) : ownedBonds.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
              <h4 style={{ marginBottom: '0.5rem' }}>No bonds in your portfolio</h4>
              <p>Start by buying some bonds in the Buy tab</p>
            </div>
          ) : (
            <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
              {ownedBonds.map((bond, index) => (
                <div 
                  key={bond.bond_name} 
                  className="portfolio-card"
                  onClick={() => setSelectedSellBond(bond)}
                  style={{ 
                    cursor: 'pointer',
                    border: selectedSellBond?.bond_name === bond.bond_name ? '2px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: '0.5rem', color: '#1e293b', fontSize: '1.1rem', fontWeight: '600' }}>
                        {bond.bond_name}
                      </h4>
                      <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        <span><strong>Symbol:</strong> {bond.bond_symbol}</span>
                        <span><strong>Units:</strong> {bond.units_remaining}</span>
                        <span><strong>Price:</strong> {formatCurrency(bond.current_price)}</span>
                        <span><strong>Total Value:</strong> {formatCurrency(bond.total_amount)}</span>
                      </div>
                    </div>
                    
                    {selectedSellBond?.bond_name === bond.bond_name && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                          <label style={{ fontSize: '0.875rem', color: '#475569', fontWeight: '500' }}>
                            Units to Sell
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={bond.units_remaining}
                            value={sellUnits}
                            onChange={(e) => setSellUnits(Number(e.target.value))}
                            placeholder="Units"
                            className="input"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => sellBond(bond.bond_name, bond.bond_symbol, bond.units_remaining, bond.current_price, sellUnits)}
                          disabled={loading || !sellUnits || sellUnits <= 0 || sellUnits > bond.units_remaining}
                          style={{ minWidth: '100px' }}
                        >
                          {loading ? (
                            <>
                              <div className="spinner"></div>
                              Selling...
                            </>
                          ) : (
                            'Sell'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
