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
  const BACKEND_URL = "http://localhost:3000";

  console.log("API_KEY", process);
  useEffect(() => { loadOwnedStocks(); }, []);
  useEffect(() => {
    if (!selectedStock) return;
    searchStock();
  }, [selectedStock]);

  async function loadOwnedStocks() {
    const stocks = await fetchJSON(`${BACKEND_URL}/api/owned`);
    let ownedStocks=stocks.json();
    console.log("Owned stocks:", ownedStocks);
    setOwnedownedStocks(stocks);
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

  async function sellStock(symbol, ownedUnits, sellUnits) {
    if (sellUnits > ownedUnits) return alert("Cannot sell more than owned");
    await fetchJSON(`${BACKEND_URL}/api/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: symbol, units: sellUnits })
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
        <div>
          {ownedStocks.map(stock => (
            <div key={stock.symbol}>
              <strong>{stock.symbol}</strong> Owned: {stock.units}
              <input type="number" id={`sell-${stock.symbol}`} placeholder="Units to sell" />
              <button onClick={() => sellStock(stock.symbol, stock.units, Number(document.getElementById(`sell-${stock.symbol}`).value))}>Sell</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}