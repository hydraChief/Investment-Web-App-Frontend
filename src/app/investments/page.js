'use client';
import { useState, useEffect } from 'react';
import { fetchJSON } from '@/lib/api';
import dynamic from 'next/dynamic';
import LineChart from '@/components/LineChart';
import StockSearch from '@/components/SearchBar';

const CandlestickChart = dynamic(() => import('@/components/CandlestickChart'), { ssr: false });

export default function InvestmentsPage() {
  const [tab, setTab] = useState('buy');
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState('');
  const [price, setPrice] = useState(0);
  const [chartType, setChartType] = useState('candlestick');
  const [chartData, setChartData] = useState([]);
  const [ownedStocks, setOwnedStocks] = useState([]);
  const [buyUnits, setBuyUnits] = useState(0);
  const [sellUnits, setSellUnits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => { 
    loadOwnedStocks(); 
  }, []);

  useEffect(() => {
    if (!selectedStock) return;
    searchStock();
  }, [selectedStock]);

  async function loadOwnedStocks() {
    try {
      setLoading(true);
    const stocks = await fetchJSON(`/api/owned`);
      setOwnedStocks(stocks || []);
    } catch (error) {
      console.error("Error loading owned stocks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function searchStock() {
    if (!search) return;
    
    try {
      setSearchLoading(true);
    setSelectedStock(search);
  
    const res = await fetch(`/api/stocks?symbol=${encodeURIComponent(search)}`);
    const json = await res.json();
  
      if (!json.chart?.result) {
        alert("Stock not found");
        return;
      }
  
    const result = json.chart.result[0];
    const timestamps = result.timestamp;
    const ohlc = result.indicators.quote[0];
    const chart = timestamps.map((ts, i) => ({
        x: new Date(ts * 1000),
        o: ohlc.open[i],
        h: ohlc.high[i],
        l: ohlc.low[i],
        c: ohlc.close[i]
      }));
    
    setPrice(ohlc.close[ohlc.close.length - 1]);
    setChartData(chart);
    } catch (error) {
      console.error("Error searching stock:", error);
      alert("Error searching for stock");
    } finally {
      setSearchLoading(false);
    }
  }

  async function buyStock() {
    if (!selectedStock || buyUnits <= 0) {
      alert("Please select a stock and enter valid units");
      return;
    }

    try {
      setLoading(true);
    await fetchJSON(`api/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          companyName: selectedStock, 
          units: buyUnits, 
          price: price, 
          type: 'buy' 
        })
      });
      
    loadOwnedStocks();
    setBuyUnits(0);
    alert("Purchase successful!");
    } catch (error) {
      console.error("Error buying stock:", error);
      alert("Error processing purchase");
    } finally {
      setLoading(false);
    }
  }

  async function sellStock(symbol, ownedUnits, pricePerUnit, sellUnits) {
    if (sellUnits > ownedUnits) {
      alert("Cannot sell more than owned");
      return;
    }

    if (sellUnits <= 0) {
      alert("Please enter valid units to sell");
      return;
    }

    try {
      setLoading(true);
    await fetchJSON(`/api/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          companyName: symbol, 
          units: sellUnits, 
          price: pricePerUnit, 
          type: 'sell' 
        })
      });
      
    alert("Sold successfully!");
    loadOwnedStocks();
    } catch (error) {
      console.error("Error selling stock:", error);
      alert("Error processing sale");
    } finally {
      setLoading(false);
    }
  }
 
  function chartHandler(type, chartData, selectedStock) {
    return {
      candlestick: <CandlestickChart data={chartData} label={selectedStock} />,
      line: <LineChart labels={chartData.map(d => d.x.toISOString().split('T')[0])} datasets={[{ label: selectedStock, data: chartData.map(d => d.c) }]} />
    }[type];
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
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Investment Management
        </h1>
        <p style={{ color: '#718096', fontSize: '1.1rem' }}>
          Buy and sell stocks, track your portfolio, and monitor market performance
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <button 
          className={`tab ${tab === 'buy' ? 'active' : ''}`}
          onClick={() => setTab('buy')}
        >
          💰 Buy Stocks
        </button>
        <button 
          className={`tab ${tab === 'sell' ? 'active' : ''}`}
          onClick={() => setTab('sell')}
        >
          📈 Sell Stocks
        </button>
      </div>

      {/* Buy Tab */}
      {tab === 'buy' && (
        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
          {/* Search and Chart Section */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', color: '#4a5568', fontSize: '1.25rem' }}>
              Market Analysis
            </h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <StockSearch 
                onSelect={(symbol) => {
              setSearch(symbol);
              setSelectedStock(symbol);
            }}
            setSearch={setSearch}
           />
              <button 
                className="btn btn-primary" 
                onClick={searchStock}
                disabled={searchLoading}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                {searchLoading ? (
                  <>
                    <div className="spinner"></div>
                    Searching...
                  </>
                ) : (
                  'Search Stock'
                )}
              </button>
            </div>

            {chartData.length > 0 && (
              <>
                <div className="tab-container" style={{ marginBottom: '1rem' }}>
                  <button 
                    className={`tab ${chartType === 'candlestick' ? 'active' : ''}`}
                    onClick={() => setChartType('candlestick')}
                  >
                    Candlestick
                  </button>
                  <button 
                    className={`tab ${chartType === 'line' ? 'active' : ''}`}
                    onClick={() => setChartType('line')}
                  >
                    Line Chart
                  </button>
                </div>
                
                <div className="chart-container">
                  {chartHandler(chartType, chartData, selectedStock)}
                </div>
              </>
            )}
          </div>

          {/* Purchase Section */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', color: '#4a5568', fontSize: '1.25rem' }}>
              Purchase Order
            </h3>

            {selectedStock && price > 0 && (
              <div className="metric-card" style={{ marginBottom: '2rem' }}>
                <div className="metric-label">Current Price</div>
                <div className="metric-value" style={{ fontSize: '2rem' }}>
                  {formatCurrency(price)}
                </div>
                <div style={{ color: '#718096', fontSize: '0.9rem' }}>
                  {selectedStock}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontWeight: '500' }}>
                Number of Units
              </label>
              <input 
                type="number" 
                value={buyUnits} 
                onChange={e => setBuyUnits(Number(e.target.value))} 
                placeholder="Enter units to buy"
                className="input"
                min="1"
              />
            </div>

            {buyUnits > 0 && price > 0 && (
              <div className="metric-card" style={{ marginBottom: '2rem' }}>
                <div className="metric-label">Total Cost</div>
                <div className="metric-value" style={{ fontSize: '1.5rem' }}>
                  {formatCurrency(buyUnits * price)}
                </div>
              </div>
            )}

            <button 
              className="btn btn-success" 
              onClick={buyStock}
              disabled={loading || !selectedStock || buyUnits <= 0}
              style={{ width: '100%', padding: '1rem' }}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                'Buy Stock'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Sell Tab */}
      {tab === 'sell' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', color: '#4a5568', fontSize: '1.25rem' }}>
            Your Portfolio
          </h3>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Loading your portfolio...
            </div>
          ) : ownedStocks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
              <h4 style={{ marginBottom: '0.5rem' }}>No stocks in your portfolio</h4>
              <p>Start by buying some stocks in the Buy tab</p>
            </div>
          ) : (
            <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
              {ownedStocks.map((stock, index) => (
                <div key={stock.company_name} className="portfolio-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <h4 style={{ marginBottom: '0.5rem', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                        {stock.full_company_name}
                      </h4>
                      <div style={{ display: 'flex', gap: '1.5rem', color: '#718096', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        <span><strong>Symbol:</strong> {stock.company_name}</span>
                        <span><strong>Units:</strong> {stock.total_units}</span>
                        <span><strong>Price:</strong> {formatCurrency(stock.price_per_unit)}</span>
                        <span><strong>Total Value:</strong> {formatCurrency(stock.total_amount)}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                        <label style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: '500' }}>
                          Units to Sell
                        </label>
              <input
                  type="number"
                  min="1"
                  max={stock.total_units}
                  onChange={(e) => setSellUnits(Number(e.target.value))}
                  placeholder="Units"
                          className="input"
                          style={{ width: '100%' }}
              />
                      </div>
              <button
                        className="btn btn-danger"
                        onClick={() => sellStock(stock.company_name, stock.total_units, stock.price_per_unit, sellUnits)}
                        disabled={loading || sellUnits <= 0 || sellUnits > stock.total_units}
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