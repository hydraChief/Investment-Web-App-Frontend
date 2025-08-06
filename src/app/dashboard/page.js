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
  const [dashboardData, setDashboardData] = useState('bonds');
  const [portfolioByName,setPortfolioByName]=useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState({});
  const [stocksPortfolioSummary, setStocksPortfolioSummary] = useState({});
  const [bondsPortfolioSummary, setBondsPortfolioSummary] = useState({});
  const [metalsPortfolioSummary, setMetalsPortfolioSummary] = useState({});
  const [transactionsByName, setTransactionsByName] = useState([]);
  const [portfolioByCategory, setPortfolioByCategory] = useState([]);
  const [transactionsByCategory, setTransactionsByCategory] = useState([]);
  const [dashboardBy, setDashboardBy] = useState('name'); // 'name' or 'category'
  async function aggregatePortfolioData() {
    try {
      let [stocksPortfolio, bondsPortfolio, metalsPortfolio, stocksTransactions, bondsTransactions, metalsTransaction] = await Promise.all([
        fetch("/api/owned").then(r => r.json()),          // stocks
        fetch("/api/bonds/owned").then(r => r.json()),    // bonds
        fetch("/api/metals/owned").then(r => r.json()),   // metals
        fetch("/api/transactions").then(r => r.json()),          // stocks
        fetch("/api/bonds/transactions").then(r => r.json()),    // bonds
        fetch("/api/metals/transactions").then(r => r.json())    // metals
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
        type:s.type,
        total_units: s.total_units,
        transaction_date: s.transaction_date,
        total_amount: s.total_amount,
      }));
  
      bondsTransactions = (bondsTransactions || []).map(s => ({
        company_name: s.bond_name,
        type:s.type,
        total_units: s.total_units,
        transaction_date: s.transaction_date,
        total_amount: s.total_amount,
      }));
  
      metalsTransaction = (metalsTransaction || []).map(s => ({
        company_name: s.metal_name,
        type:s.type,
        total_units: s.total_units,
        transaction_date: s.transaction_date,
        total_amount: s.total_amount,
      }));
  
      const combinedTransactionsByName = [...stocksTransactions, ...bondsTransactions, ...metalsTransaction];
     
      const portfolioSummary = combinedPortfolioByName.reduce((acc, item) => {
        acc.total_amount += item.total_amount;
        acc.previous_total_amount += item.previous_total_amount;
        return acc;
      }, { name:'All',total_amount: 0, previous_total_amount: 0 });
  
      const stocksPortfolioSummary = stocksPortfolio.reduce((acc, item) => {
        acc.total_amount += item.total_amount;
        acc.previous_total_amount += item.previous_total_amount;
        acc.total_amount += item.total_amount;
        acc.total_units += item.total_units;
        return acc;
      }, { name:'Stocks',total_amount: 0, previous_total_amount: 0 ,total_amount:0, total_units: 0});

      const bondsPortfolioSummary = bondsPortfolio.reduce((acc, item) => {
        acc.total_amount += item.total_amount;
        acc.previous_total_amount += item.previous_total_amount;
        acc.total_amount += item.total_amount;
        acc.total_units += item.total_units;
        return acc;
      }, { name:'Bonds',total_amount: 0, previous_total_amount: 0 ,total_amount:0, total_units: 0});

      const metalsPortfolioSummary = metalsPortfolio.reduce((acc, item) => {
        acc.total_amount += item.total_amount;
        acc.previous_total_amount += item.previous_total_amount;
        acc.total_amount += item.total_amount;
        acc.total_units += item.total_units;
        return acc;
      }, { name:'Metals',total_amount: 0, previous_total_amount: 0 ,total_amount:0, total_units: 0});
      console.log('bondsPortfolioSummary:', bondsPortfolioSummary);
      
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
    }
  }
  
  useEffect(() => {
    if (dashboardData==='all') {
      aggregatePortfolioData();
    }
  }, [dashboardData]);

  useEffect(() => {
    (async () => {
      let portfolioData = await fetchJSON(`/api/owned`,{method: 'GET'});
      console.log("Portfolio data:", portfolioData);
      setPortfolioStocks(portfolioData);
      let transactionsData = await fetchJSON(`/api/transactions`,{method: 'GET'});
      console.log("Transactions data:", transactionsData);
      setTransactionsStocks(transactionsData);

      // Fetch bonds data
      let portfolioBondsData = await fetchJSON(`/api/bonds/owned`,{method: 'GET'});
      console.log("Portfolio bonds data:", portfolioBondsData);
      setPortfolioBonds(portfolioBondsData);
      let transactionsBondsData = await fetchJSON(`/api/bonds/transactions`,{method: 'GET'});
      console.log("Transactions bonds data:", transactionsBondsData);
      setTransactionsBonds(transactionsBondsData);

      // Fetch precious metals data

      let portfolioMetalsData = await fetchJSON(`/api/metals/owned`,{method: 'GET'});
      console.log("Portfolio precious metals data:", portfolioMetalsData);  
      setPortfolioMetals(portfolioMetalsData);
      let transactionsMetalsData = await fetchJSON(`/api/metals/transactions`,{method: 'GET'});
      console.log("Transactions precious metals data:", transactionsMetalsData);
      setTransactionsMetals(transactionsMetalsData);
    })();
  }, []);

  return (
    <div>
      
      <button onClick={() => setDashboardData('all')}>Overview</button>
      <button onClick={() => setDashboardData('bonds')}>Bonds</button>
      <button onClick={() => setDashboardData('stocks')}>stocks</button>
      <button onClick={() => setDashboardData('precious_metals')}>Precious Metals</button>
      {/* stocks */}
      {dashboardData=='stocks' && (
        <>
          <h2>Stock Distribution by Units</h2>
          <PieChart labels={portfolioStocks.map(p => p.company_name +` (${p.full_company_name})`)} data={portfolioStocks.map(p => p.total_units)} />
          <h2>Stock Distribution by Value</h2>
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart labels={portfolioStocks.map(p => p.company_name +` (${p.full_company_name})`)} data={portfolioStocks.map(p => p.total_amount)} />
            {/* <PieChart labels={portfolioStocks.map(p => p.company_name +` (${p.full_company_name})`)} data={portfolioStocks.map(p => p.total_amount)} /> */}
              <DonutChart type='stocks' portfolio={portfolioStocks} />
          </div>

          <h2>Buy/Sell Timeline</h2>
          <div style={{ width: '100%', height: '100%' }}>
            <StackedColumnChart data={transactionsStocks} />
            <HeatmapChart data={transactionsStocks} />
            <PortfolioCharts data={transactionsStocks} />
          </div>
        </>
      )}
      {/* bonds */}
      {dashboardData=='bonds' && (
        <>
          <h2>Stock Distribution by Units</h2>
          <PieChart labels={portfolioBonds.map(p => p.bond_name +` (${p.bond_symbol})`)} data={portfolioBonds.map(p => p.units_remaining)} />
          <h2>Stock Distribution by Value</h2>
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart labels={portfolioBonds.map(p => p.bond_name +` (${p.bond_symbol})`)} data={portfolioBonds.map(p => p.total_amount)} />
            {/* <PieChart labels={portfolioBonds.map(p => p.bond_name +` (${p.bond_symbol})`)} data={portfolioBonds.map(p => p.total_amount)} /> */}
              <DonutChart type='bonds' portfolio={portfolioBonds} />
          </div>

          <h2>Buy/Sell Timeline</h2>
          <div style={{ width: '100%', height: '100%' }}>
            <StackedColumnChart type='bonds' data={transactionsBonds} />
            <HeatmapChart type='bonds' data={transactionsBonds} />
            <PortfolioCharts type='bonds' data={transactionsBonds} />
          </div>
        </>
      )}
      {/* precious_metals */}
      {dashboardData=='precious_metals' && (
        <>
         <h2>Stock Distribution by Units</h2>
          <PieChart labels={portfolioMetals.map(p => p.metal_name +` (${p.metal_symbol})`)} data={portfolioMetals.map(p => p.units_remaining)} />
          <h2>Stock Distribution by Value</h2>
          <div style={{ width: '100%', height: '100%' }}>
            <BarChart labels={portfolioMetals.map(p => p.metal_name +` (${p.metal_symbol})`)} data={portfolioMetals.map(p => p.total_amount)} />
            {/* <PieChart labels={portfolioMetals.map(p => p.metal_name +` (${p.metal_symbol})`)} data={portfolioMetals.map(p => p.total_amount)} /> */}
              <DonutChart portfolio={portfolioMetals} />
          </div>

          <h2>Buy/Sell Timeline</h2>
          <div style={{ width: '100%', height: '100%' }}>
            <StackedColumnChart type='precious_metals' data={transactionsMetals} />
            <HeatmapChart type='precious_metals' data={transactionsMetals} />
            <PortfolioCharts type='precious_metals' data={transactionsMetals} />
          </div>
        </>
      )}
      {/* all */}
      {dashboardData=='all' && (
          <>
            <button onClick={() => setDashboardBy('name')}>By Name</button>
            <button onClick={() => setDashboardBy('category')}>By Category</button>
              <>
                {(dashboardBy=='name' && (
                  <>
                    <h2>Portfolio Distribution by Name</h2>
                    <PieChart labels={portfolioByName.map(p => p.name )} data={portfolioByName.map(p => p.total_units)} />
                    <h2>Portfolio Distribution by Value</h2>
                    <div style={{ width: '100%', height: '100%' }}>
                      <BarChart labels={portfolioByName.map(p => p.name )} data={portfolioByName.map(p => p.total_amount)} />
                      {/* <PieChart labels={portfolioByName.map(p => p.name )} data={portfolioByName.map(p => p.total_amount)} /> */}
                        <DonutChart type='allByName' portfolio={portfolioByName} />
                    </div>
          
                    <h2>Buy/Sell Timeline</h2>
                    <div style={{ width: '100%', height: '100%' }}>
                      <StackedColumnChart type='allByName' data={transactionsByName} />
                      <HeatmapChart type='allByName' data={transactionsByName} />
                      <PortfolioCharts type='allByName' data={transactionsByName} />
                    </div>
                  </>
                ))}
            </>

            <>
              { (dashboardBy=='category' && (
                  <>
                    <h2>Stock Distribution by Units</h2>
                    <PieChart labels={portfolioByCategory.map(p => p.name)} data={portfolioByCategory.map(p => p.total_units)} />
                    <h2>Stock Distribution by Value</h2>
                    <div style={{ width: '100%', height: '100%' }}>
                      <BarChart labels={portfolioByCategory.map(p => p.name)} data={portfolioByCategory.map(p => p.total_amount)} />
                      {/* <PieChart labels={portfolioByCategory.map(p => p.name)} data={portfolioByCategory.map(p => p.total_amount)} /> */}
                        <DonutChart type='allByCategory' portfolio={portfolioByCategory} />
                    </div>
          
                    <h2>Buy/Sell Timeline</h2>
                    <div style={{ width: '100%', height: '100%' }}>
                      <StackedColumnChart type='allByCategory' data={transactionsByCategory} />
                      <HeatmapChart type='allByCategory' data={transactionsByCategory} />
                      <PortfolioCharts type='allByCategory' data={transactionsByCategory} />
                    </div>
                  </>
                ))}
            </>
          </>
      )}
    </div>
  );
}