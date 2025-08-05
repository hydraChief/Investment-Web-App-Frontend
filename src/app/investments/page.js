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

  useEffect(() => { loadOwnedStocks(); }, []);
  useEffect(() => {
    if (!selectedStock) return;
    searchStock();
  }, [selectedStock]);

  async function loadOwnedStocks() {
    const stocks = await fetchJSON(`/api/owned`);
    let ownedStocks = stocks;
    console.log("Owned stocks:", ownedStocks);
    setOwnedStocks(ownedStocks);
  }

  async function searchStock() {
    console.log("Searching for stock:", search);
    if (!search) return;
    setSelectedStock(search);
  
    const res = await fetch(`/api/stocks?symbol=${encodeURIComponent(search)}`);
    const json = await res.json();
  
    if (!json.chart?.result) return alert("Stock not found");
  
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
  }
  
  

  async function buyStock() {
    await fetchJSON(`api/buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  companyName:selectedStock, units:buyUnits, price:price, type: 'buy' })
    });
    loadOwnedStocks();
    setBuyUnits(0);
    alert("Purchase successful!");
  }

  async function sellStock(symbol, ownedUnits, pricePerUnit, sellUnits) {
    if (sellUnits > ownedUnits) return alert("Cannot sell more than owned");
    await fetchJSON(`/api/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  companyName:symbol, units:sellUnits, price:pricePerUnit, type: 'sell' })
    });
    alert("Sold successfully!");
    loadOwnedStocks();
  }
 
  function chartHandler(type, chartData, selectedStock) {
    return  {candlestick: <CandlestickChart data={chartData} label={selectedStock} />,
     line : <LineChart labels={chartData.map(d => d.x.toISOString().split('T')[0])} datasets={[{ label: selectedStock, data: chartData.map(d => d.c) }]} />
    }[type]
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={() => setTab('buy')} style={{ background: tab === 'buy' ? '#1abc9c' : '#ddd' }}>Buy</button>
        <button onClick={() => setTab('sell')} style={{ background: tab === 'sell' ? '#1abc9c' : '#ddd' }}>Sell</button>
      </div>

      {tab === 'buy' && (
        <div>
          <StockSearch onSelect={(symbol) => {
              console.log("Selected stock:", symbol);
              setSearch(symbol);
              setSelectedStock(symbol);
            }}
            setSearch={setSearch}
           />
          <button onClick={searchStock}>Search</button>
          <section>
            <button onClick={() => setChartType('candlestick')}>Candlestick</button>
            <button onClick={() => setChartType('line')}>Line</button>
          </section>
          {chartData.length > 0 && chartHandler(chartType, chartData, selectedStock)}
          <input type="number" value={buyUnits} onChange={e => setBuyUnits(Number(e.target.value))} placeholder="Units" />
          <button onClick={buyStock}>Buy</button>
        </div>
      )}

      {tab === 'sell' && (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '10px',
            fontWeight: 'bold',
            borderBottom: '2px solid #ccc',
            padding: '8px 0'
        }}>
            <div>Name</div>
            <div>Symbol</div>
            <div>Units</div>
            <div>Current Price</div>
      <div>Action</div>

    {ownedStocks.map(stock => (
      <div
          key={stock.company_name}
          style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              gap: '10px',
              padding: '8px 0',
              borderBottom: '1px solid #eee',
              alignItems: 'center'
          }}
      >
          <div>{stock.full_company_name}</div>
          <div>{stock.company_name}</div>
          <div>{stock.total_units}</div>
          <div>${stock.price_per_unit?.toFixed(2)}</div>
          <div style={{ display: 'flex', gap: '5px' }}>
              <input
                  type="number"
                  min="1"
                  max={stock.total_units}
                  onChange={(e) => setSellUnits(Number(e.target.value))}
                  placeholder="Units"
                  style={{ width: '60px' }}
              />
              <button
                  onClick={() =>
                      sellStock(stock.company_name, stock.total_units, stock.price_per_unit, sellUnits)
                  }
              >
                  Sell
              </button>
          </div>
      </div>
    ))}
      </div>
      )}
  </div>
  );}