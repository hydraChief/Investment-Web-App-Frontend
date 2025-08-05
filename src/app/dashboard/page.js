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
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      let portfolioData = await fetchJSON(`/api/owned`,{method: 'GET'});
      console.log("Portfolio data:", portfolioData);
      setPortfolio(portfolioData);
      let transactionsData = await fetchJSON(`/api/transactions`,{method: 'GET'});
      console.log("Transactions data:", transactionsData);
      setTransactions(transactionsData);
    })();
  }, []);

  return (
    <div>
      <h2>Stock Distribution by Units</h2>
      <PieChart labels={portfolio.map(p => p.company_name +` (${p.full_company_name})`)} data={portfolio.map(p => p.total_units)} />
      <h2>Stock Distribution by Value</h2>
      <div style={{ width: '100%', height: '100%' }}>
        <BarChart labels={portfolio.map(p => p.company_name +` (${p.full_company_name})`)} data={portfolio.map(p => p.total_amount)} />
        {/* <PieChart labels={portfolio.map(p => p.company_name +` (${p.full_company_name})`)} data={portfolio.map(p => p.total_amount)} /> */}
          <DonutChart portfolio={portfolio} />
      </div>

      <h2>Buy/Sell Timeline</h2>
      <div style={{ width: '100%', height: '100%' }}>
        <StackedColumnChart data={transactions} />
        <HeatmapChart data={transactions} />
        <PortfolioCharts data={transactions} />
      </div>
    </div>
  );
}