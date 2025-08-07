'use client';
import { useEffect, useState } from 'react';
import { fetchJSON } from '@/lib/api';
import dynamic from 'next/dynamic';

const PieChart = dynamic(() => import('@/components/PieChart'), { ssr: false });
const PortfolioCharts = dynamic(() => import('@/components/PortfolioCharts'), { ssr: false });
const BarChart = dynamic(() => import('@/components/BarChart'), { ssr: false });
const StackedColumnChart = dynamic(() => import('@/components/StackedColumnChart'), { ssr: false });
const HeatmapChart = dynamic(() => import('@/components/HeatMapChart'), { ssr: false });
const DonutChart = dynamic(() => import('@/components/DonutChart'), { ssr: false });

export default function DashboardPage() {
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [transactionsStocks, setTransactionsStocks] = useState([]);
  const [portfolioBonds, setPortfolioBonds] = useState([]);
  const [transactionsBonds, setTransactionsBonds] = useState([]);
  const [portfolioMetals, setPortfolioMetals] = useState([]);
  const [transactionsMetals, setTransactionsMetals] = useState([]);
  const [dashboardData, setDashboardData] = useState('all');
  const [portfolioByName, setPortfolioByName] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState({});
  const [stocksPortfolioSummary, setStocksPortfolioSummary] = useState({});
  const [bondsPortfolioSummary, setBondsPortfolioSummary] = useState({});
  const [metalsPortfolioSummary, setMetalsPortfolioSummary] = useState({});
  const [transactionsByName, setTransactionsByName] = useState([]);
  const [portfolioByCategory, setPortfolioByCategory] = useState([]);
  const [transactionsByCategory, setTransactionsByCategory] = useState([]);
  const [dashboardBy, setDashboardBy] = useState('name');
  const [loading, setLoading] = useState(true);

  async function aggregatePortfolioData() {
    try {
      setLoading(true);
      let [stocksPortfolio, bondsPortfolio, metalsPortfolio, stocksTransactions, bondsTransactions, metalsTransaction] = await Promise.all([
        fetch("/api/owned").then(r => r.json()),
        fetch("/api/bonds/owned").then(r => r.json()),
        fetch("/api/metals/owned").then(r => r.json()),
        fetch("/api/transactions").then(r => r.json()),
        fetch("/api/bonds/transactions").then(r => r.json()),
        fetch("/api/metals/transactions").then(r => r.json())
      ]);
  
      // Normalize each type to same structure
      stocksPortfolio = (stocksPortfolio || []).map(s => ({
        name: s.company_name || s.full_company_name || s.short_company_name,
        symbol: s.short_company_name || s.company_name,
        type: "stock",
        total_units: Number(s.total_units) || 0,
        current_price: Number(s.price_per_unit) || 0,
        total_amount: Number(s.total_amount) || 0,
        previous_price: Number(s.previous_price) || 0,
        previous_total_amount: Number(s.previous_total_amount) || 0
      }));
  
      bondsPortfolio = (bondsPortfolio || []).map(b => ({
        name: b.bond_name,
        symbol: b.bond_symbol,
        type: "bond",
        total_units: Number(b.units_remaining) || 0,
        current_price: Number(b.current_price) || 0,
        total_amount: Number(b.total_amount) || 0,
        previous_price: Number(b.previous_price) || 0,
        previous_total_amount: Number(b.previous_total_amount) || 0
      }));
  
      metalsPortfolio = (metalsPortfolio || []).map(m => ({
        name: m.metal_name,
        symbol: m.metal_symbol,
        type: "metal",
        total_units: Number(m.units_remaining) || 0,
        current_price: Number(m.current_price) || 0,
        total_amount: Number(m.total_amount) || 0,
        previous_price: Number(m.previous_price) || 0,
        previous_total_amount: Number(m.previous_total_amount) || 0
      }));
  
      const combinedPortfolioByName = [...stocksPortfolio, ...bondsPortfolio, ...metalsPortfolio];

      stocksTransactions = (stocksTransactions || []).map(s => ({
        company_name: s.company_name,
        type: s.type,
        total_units: s.total_units,
        transaction_date: s.transaction_date,
        total_amount: s.total_amount,
      }));
  
      bondsTransactions = (bondsTransactions || []).map(s => ({
        company_name: s.bond_name,
        type: s.type,
        total_units: s.total_units,
        transaction_date: s.transaction_date,
        total_amount: s.total_amount,
      }));
  
      metalsTransaction = (metalsTransaction || []).map(s => ({
        company_name: s.metal_name,
        type: s.type,
        total_units: s.total_units,
        transaction_date: s.transaction_date,
        total_amount: s.total_amount,
      }));
  
      const combinedTransactionsByName = [...stocksTransactions, ...bondsTransactions, ...metalsTransaction];
     
      const portfolioSummary = combinedPortfolioByName.reduce((acc, item) => {
        acc.total_amount += item.total_amount;
        acc.previous_total_amount += item.previous_total_amount;
        return acc;
      }, { name: 'All', total_amount: 0, previous_total_amount: 0 });
  
      const stocksPortfolioSummary = stocksPortfolio.reduce((acc, item) => {
        acc.total_amount += item.total_amount;
        acc.previous_total_amount += item.previous_total_amount;
        acc.total_units += item.total_units;
        return acc;
      }, { name: 'Stocks', total_amount: 0, previous_total_amount: 0, total_units: 0 });

      const bondsPortfolioSummary = bondsPortfolio.reduce((acc, item) => {
        acc.total_amount += item.total_amount;
        acc.previous_total_amount += item.previous_total_amount;
        acc.total_units += item.total_units;
        return acc;
      }, { name: 'Bonds', total_amount: 0, previous_total_amount: 0, total_units: 0 });

      const metalsPortfolioSummary = metalsPortfolio.reduce((acc, item) => {
        acc.total_amount += item.total_amount;
        acc.previous_total_amount += item.previous_total_amount;
        acc.total_units += item.total_units;
        return acc;
      }, { name: 'Metals', total_amount: 0, previous_total_amount: 0, total_units: 0 });
      
      setPortfolioByName(combinedPortfolioByName);
      setPortfolioSummary(portfolioSummary);
      setStocksPortfolioSummary(stocksPortfolioSummary);
      setBondsPortfolioSummary(bondsPortfolioSummary);
      setMetalsPortfolioSummary(metalsPortfolioSummary);
      setTransactionsByName(combinedTransactionsByName);
      setPortfolioByCategory([stocksPortfolioSummary, bondsPortfolioSummary, metalsPortfolioSummary]);
      setTransactionsByCategory([stocksTransactions.map(t => ({ ...t, name: 'stocks' })), 
        bondsTransactions.map(t => ({ ...t, name: 'bonds' })), 
        metalsTransaction.map(t => ({ ...t, name: 'metals' }))].flat());
    } catch (err) {
      console.error("Error aggregating portfolio data:", err);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    if (dashboardData === 'all') {
      aggregatePortfolioData();
    }
  }, [dashboardData]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let portfolioData = await fetchJSON(`/api/owned`, { method: 'GET' });
      setPortfolioStocks(portfolioData);
        let transactionsData = await fetchJSON(`/api/transactions`, { method: 'GET' });
      setTransactionsStocks(transactionsData);

        let portfolioBondsData = await fetchJSON(`/api/bonds/owned`, { method: 'GET' });
      setPortfolioBonds(portfolioBondsData);
        let transactionsBondsData = await fetchJSON(`/api/bonds/transactions`, { method: 'GET' });
      setTransactionsBonds(transactionsBondsData);

        let portfolioMetalsData = await fetchJSON(`/api/metals/owned`, { method: 'GET' });
      setPortfolioMetals(portfolioMetalsData);
        let transactionsMetalsData = await fetchJSON(`/api/metals/transactions`, { method: 'GET' });
      setTransactionsMetals(transactionsMetalsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateChange = (current, previous) => {
    if (!previous) return { value: 0, percentage: 0 };
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return { value: change, percentage };
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading portfolio data...
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Portfolio Dashboard
        </h1>
        <p style={{ color: '#718096', fontSize: '1.1rem' }}>
          Track your investments and monitor performance across all asset classes
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-container">
        <button 
          className={`tab ${dashboardData === 'all' ? 'active' : ''}`}
          onClick={() => setDashboardData('all')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab ${dashboardData === 'stocks' ? 'active' : ''}`}
          onClick={() => setDashboardData('stocks')}
        >
          📈 Stocks
        </button>
        <button 
          className={`tab ${dashboardData === 'bonds' ? 'active' : ''}`}
          onClick={() => setDashboardData('bonds')}
        >
          🏛️ Bonds
        </button>
        <button 
          className={`tab ${dashboardData === 'precious_metals' ? 'active' : ''}`}
          onClick={() => setDashboardData('precious_metals')}
        >
          🥇 Precious Metals
        </button>
      </div>

      {/* Metric Cards */}
      {dashboardData === 'all' && (
        <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
          <div className="metric-card">
            <div className="metric-value">
              {formatCurrency(portfolioSummary.total_amount || 0)}
            </div>
            <div className="metric-label">Total Portfolio Value</div>
            {portfolioSummary.previous_total_amount && (
              <div className={`metric-change ${calculateChange(portfolioSummary.total_amount, portfolioSummary.previous_total_amount).value >= 0 ? 'positive' : 'negative'}`}>
                {calculateChange(portfolioSummary.total_amount, portfolioSummary.previous_total_amount).value >= 0 ? '↗' : '↘'}
                {formatCurrency(Math.abs(calculateChange(portfolioSummary.total_amount, portfolioSummary.previous_total_amount).value))}
                ({calculateChange(portfolioSummary.total_amount, portfolioSummary.previous_total_amount).percentage.toFixed(2)}%)
              </div>
            )}
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {formatCurrency(stocksPortfolioSummary.total_amount || 0)}
            </div>
            <div className="metric-label">Stocks Value</div>
            <div className="metric-change">
              {stocksPortfolioSummary.total_units || 0} units
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {formatCurrency(bondsPortfolioSummary.total_amount || 0)}
            </div>
            <div className="metric-label">Bonds Value</div>
            <div className="metric-change">
              {bondsPortfolioSummary.total_units || 0} units
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-value">
              {formatCurrency(metalsPortfolioSummary.total_amount || 0)}
            </div>
            <div className="metric-label">Metals Value</div>
            <div className="metric-change">
              {metalsPortfolioSummary.total_units || 0} units
            </div>
          </div>
        </div>
      )}

      {/* View Toggle for Overview */}
      {dashboardData === 'all' && (
        <div className="tab-container" style={{ marginBottom: '2rem' }}>
          <button 
            className={`tab ${dashboardBy === 'name' ? 'active' : ''}`}
            onClick={() => setDashboardBy('name')}
          >
            By Investment Name
          </button>
          <button 
            className={`tab ${dashboardBy === 'category' ? 'active' : ''}`}
            onClick={() => setDashboardBy('category')}
          >
            By Asset Category
          </button>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        {dashboardData === 'stocks' && (
          <>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Stock Distribution by Units</h3>
              <PieChart labels={portfolioStocks.map(p => p.company_name + ` (${p.full_company_name})`)} data={portfolioStocks.map(p => p.total_units)} />
          </div>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Stock Distribution by Value</h3>
              <BarChart labels={portfolioStocks.map(p => p.company_name + ` (${p.full_company_name})`)} data={portfolioStocks.map(p => p.total_amount)} />
          </div>
        </>
      )}

        {dashboardData === 'bonds' && (
          <>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Bond Distribution by Units</h3>
              <PieChart labels={portfolioBonds.map(p => p.bond_name + ` (${p.bond_symbol})`)} data={portfolioBonds.map(p => p.units_remaining)} />
            </div>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Bond Distribution by Value</h3>
              <BarChart labels={portfolioBonds.map(p => p.bond_name + ` (${p.bond_symbol})`)} data={portfolioBonds.map(p => p.total_amount)} />
            </div>
          </>
        )}

        {dashboardData === 'precious_metals' && (
          <>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Metals Distribution by Units</h3>
              <PieChart labels={portfolioMetals.map(p => p.metal_name + ` (${p.metal_symbol})`)} data={portfolioMetals.map(p => p.units_remaining)} />
                    </div>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Metals Distribution by Value</h3>
              <BarChart labels={portfolioMetals.map(p => p.metal_name + ` (${p.metal_symbol})`)} data={portfolioMetals.map(p => p.total_amount)} />
                    </div>
                  </>
        )}

        {dashboardData === 'all' && dashboardBy === 'name' && (
          <>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Portfolio Distribution by Name</h3>
              <PieChart labels={portfolioByName.map(p => p.name)} data={portfolioByName.map(p => p.total_units)} />
                    </div>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Portfolio Distribution by Value</h3>
              <BarChart labels={portfolioByName.map(p => p.name)} data={portfolioByName.map(p => p.total_amount)} />
                    </div>
                  </>
        )}

        {dashboardData === 'all' && dashboardBy === 'category' && (
          <>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Portfolio Distribution by Category</h3>
              <PieChart labels={portfolioByCategory.map(p => p.name)} data={portfolioByCategory.map(p => p.total_units)} />
            </div>
            <div className="chart-container">
              <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Portfolio Value by Category</h3>
              <BarChart labels={portfolioByCategory.map(p => p.name)} data={portfolioByCategory.map(p => p.total_amount)} />
            </div>
          </>
      )}
      </div>

      {/* Transaction Timeline */}
      <div className="chart-container">
        <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Transaction Timeline</h3>
        {dashboardData === 'stocks' && <StackedColumnChart data={transactionsStocks} />}
        {dashboardData === 'bonds' && <StackedColumnChart type='bonds' data={transactionsBonds} />}
        {dashboardData === 'precious_metals' && <StackedColumnChart type='precious_metals' data={transactionsMetals} />}
        {dashboardData === 'all' && dashboardBy === 'name' && <StackedColumnChart type='allByName' data={transactionsByName} />}
        {dashboardData === 'all' && dashboardBy === 'category' && <StackedColumnChart type='allByCategory' data={transactionsByCategory} />}
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-2" style={{ marginTop: '2rem' }}>
        <div className="chart-container">
          <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Portfolio Heatmap</h3>
          {dashboardData === 'stocks' && <HeatmapChart data={transactionsStocks} />}
          {dashboardData === 'bonds' && <HeatmapChart type='bonds' data={transactionsBonds} />}
          {dashboardData === 'precious_metals' && <HeatmapChart type='precious_metals' data={transactionsMetals} />}
          {dashboardData === 'all' && dashboardBy === 'name' && <HeatmapChart type='allByName' data={transactionsByName} />}
          {dashboardData === 'all' && dashboardBy === 'category' && <HeatmapChart type='allByCategory' data={transactionsByCategory} />}
        </div>
        <div className="chart-container">
          <h3 style={{ marginBottom: '1rem', color: '#4a5568' }}>Performance Analysis</h3>
          {dashboardData === 'stocks' && <PortfolioCharts data={transactionsStocks} />}
          {dashboardData === 'bonds' && <PortfolioCharts type='bonds' data={transactionsBonds} />}
          {dashboardData === 'precious_metals' && <PortfolioCharts type='precious_metals' data={transactionsMetals} />}
          {dashboardData === 'all' && dashboardBy === 'name' && <PortfolioCharts type='allByName' data={transactionsByName} />}
          {dashboardData === 'all' && dashboardBy === 'category' && <PortfolioCharts type='allByCategory' data={transactionsByCategory} />}
        </div>
      </div>
    </div>
  );
}