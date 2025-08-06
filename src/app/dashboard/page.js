'use client';
import { useEffect, useState } from 'react';
import { fetchJSON } from '@/lib/api';
import { FaRegSadTear } from "react-icons/fa";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import './dashboard.css'
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
    <div className='main-container'>
      <div className='category-btns'>
        <span className={'category-btn'+ (dashboardData=='all'?' active':'')} onClick={() => setDashboardData('all')}>Overview</span>
        <span className={'category-btn'+ (dashboardData=='bonds'?' active':'')} onClick={() => setDashboardData('bonds')}>Bonds</span>
        <span className={'category-btn'+ (dashboardData=='stocks'?' active':'')} onClick={() => setDashboardData('stocks')}>stocks</span>
        <span className={'category-btn'+ (dashboardData=='precious_metals'?' active':'')} onClick={() => setDashboardData('precious_metals')}>Precious Metals</span>
      </div>
      {/* stocks */}
      {dashboardData=='stocks' && (portfolioStocks.length>0?(
        <div className='chart-main-container'>
          <div className='value-container'>
            <h2>Stock Distribution by Value</h2>
            <div className='donut'>
              <DonutChart type='stocks' portfolio={portfolioStocks} />
            </div>
          </div>
          <div className='units-container'>
            <h2>Stock Distribution by Units</h2>
            <div className='piechart'>
              <PieChart labels={portfolioStocks.map(p => p.company_name +` (${p.full_company_name})`)} data={portfolioStocks.map(p => p.total_units)} />
            </div>
          </div>
        
          <div style={{height:'100%', width:'100%'}}>
            <h2>Buy/Sell Timeline</h2>
            <div className='stackedchart'>
              <StackedColumnChart data={transactionsStocks} />
            </div>
            <div className='heatmapchart'>
              <HeatmapChart data={transactionsStocks} />
            </div>
            <div className='portfoliochart'>
              <PortfolioCharts data={transactionsStocks} />
            </div>
          </div>
        </div>
      ):(
        <div className='sorry-container'>
          <h2> <FaRegSadTear />No Stocks in portfolio</h2>
          <h3>
            Buy <Link href='/stocks'>Stocks</Link>
          </h3>
        </div>
      ))}
      {/* bonds */}
      {dashboardData=='bonds' && (portfolioBonds.length>0? (
        <div className='chart-main-container'>
          <div className='value-container'>
            <h2>Stock Distribution by Value</h2>
            <div className='donut'>
              <DonutChart type='bonds' portfolio={portfolioBonds} />
            </div>
          </div>
          <div className='units-container'>  
            <h2>Stock Distribution by Units</h2>
            <div className='piechart'>
              <PieChart labels={portfolioBonds.map(p => p.bond_name +` (${p.bond_symbol})`)} data={portfolioBonds.map(p => p.units_remaining)} />
            </div>
          </div>

          <div style={{height:'100%', width:'100%'}}>
            <h2>Buy/Sell Timeline</h2>
            <div className='stackedchart'>
              <StackedColumnChart type='bonds' data={transactionsBonds} />
            </div>
            <div className='heatmap'>
              <HeatmapChart type='bonds' data={transactionsBonds} />
            </div>
            <div className='portfoliochart'>
              <PortfolioCharts type='bonds' data={transactionsBonds} />
            </div>
          </div>
        </div>
      ):(
        <div className='sorry-container'>
          <h2> <FaRegSadTear /> No Bonds in your portfolio</h2>
          <h3>
            Buy <Link href='/bonds'>Bonds</Link>
          </h3>
        </div>
      ))}
      {/* precious_metals */}
      {dashboardData=='precious_metals' && (portfolioMetals.length>0?(
        <div className='chart-main-container'>
          <div className='value-container'>
            <h2>Stock Distribution by Value</h2>
            <div className='donut'>
              <DonutChart type='precious_metals' portfolio={portfolioMetals} />
            </div>
          </div>
          <div className='units-container'>
            <h2>Precious Metals Distribution by Units (10gm)</h2>
            <div className='piechart'>
              <PieChart labels={portfolioMetals.map(p => p.metal_name +` (${p.metal_symbol})`)} data={portfolioMetals.map(p => p.units_remaining)} />
            </div>
          </div>

          <div style={{ width: '100%', height: '100%' }}>
            <h2>Buy/Sell Timeline</h2>
            <div className='stackedchart'>
              <StackedColumnChart type='precious_metals' data={transactionsMetals} />
            </div>
            <div className='heatmap'>
              <HeatmapChart type='precious_metals' data={transactionsMetals} />
            </div>
            <div className='portfoliochart'>
              <PortfolioCharts type='precious_metals' data={transactionsMetals} />
            </div>
          </div>
        </div>
      ):(
        <div className='sorry-container'>
          <h2> <FaRegSadTear /> No Precious Metals in your portfolio</h2>
          <h3>
            Buy <Link href='/metals'>Precious Metals</Link>
          </h3>
        </div>
      ))}
      {/* all */}
      {dashboardData=='all' && (portfolioByName.length>0?(
          <div className='chart-main-container'>
            <div className='dashboardby'>
              <div onClick={() => setDashboardBy('name')}> <span className={'dashboardby-radio'+ (dashboardBy=='name'?' radio-active':'')}></span>By Name</div>
              <div onClick={() => setDashboardBy('category')}><span className={'dashboardby-radio'+ (dashboardBy=='category'?' radio-active':'')}></span>By Category</div>
            </div>
            <>
              {(dashboardBy=='name' && (
                <>
                  <div className='value-container'>
                    <h2>Portfolio Distribution by Value</h2>
                    <div className='donut'>
                      <DonutChart type='allByName' portfolio={portfolioByName} />
                    </div>
                  </div>
                  <div className='units-container'>
                    <h2>Portfolio Distribution by Name</h2>
                    <div className='piechart'>
                      <PieChart labels={portfolioByName.map(p => p.name )} data={portfolioByName.map(p => p.total_units)} />
                    </div>
                  </div>
        
                  <div style={{ width: '100%', height: '100%' }}>
                    <h2>Buy/Sell Timeline</h2>
                    <div className='stackedchart'>
                      <StackedColumnChart type='allByName' data={transactionsByName} />
                    </div>
                    <div className='heatmap'>
                      <HeatmapChart type='allByName' data={transactionsByName} />
                    </div>
                    <div className='portfoliochart'>
                      <PortfolioCharts type='allByName' data={transactionsByName} />
                    </div>
                  </div>
                </>
              ))}
            </>

            <>
              { (dashboardBy=='category' && (
                  <>
                  <div className='value-container'>
                    <h2>Portfolio Distribution by Value</h2>
                    <div className='donut'>
                      <DonutChart type='allByName' portfolio={portfolioByCategory} />
                    </div>
                  </div>
                  <div className='units-container'>
                    <h2>Portfolio Distribution by Name</h2>
                    <div className='piechart'>
                      <PieChart labels={portfolioByCategory.map(p => p.name )} data={portfolioByCategory.map(p => p.total_units)} />
                    </div>
                  </div>
        
                  <div style={{ width: '100%', height: '100%' }}>
                    <h2>Buy/Sell Timeline</h2>
                    <div className='stackedchart'>
                      <StackedColumnChart type='allByName' data={transactionsByCategory} />
                    </div>
                    <div className='heatmap'>
                      <HeatmapChart type='allByName' data={transactionsByCategory} />
                    </div>
                    <div className='portfoliochart'>
                      <PortfolioCharts type='allByName' data={transactionsByCategory} />
                    </div>
                  </div>
                </>
                ))}
            </>
          </div>
      ):(
        <div className='sorry-container'>
          <h2> <FaRegSadTear /> You have nothing in your portfolio, please buy!!
          </h2>
        </div>
      ))}
    </div>
  );
}