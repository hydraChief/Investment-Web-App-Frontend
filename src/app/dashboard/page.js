'use client';
import { useEffect, useState } from 'react';
import { fetchJSON } from '@/lib/api';
import dynamic from 'next/dynamic';

const PieChart = dynamic(() => import('@/components/PieChart'), { ssr: false });
const LineChart = dynamic(() => import('@/components/LineChart'), { ssr: false });

export default function DashboardPage() {
  const [portfolio, setPortfolio] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const BACKEND_URL = "http://localhost:3000";

  useEffect(() => {
    (async () => {
      setPortfolio(await fetchJSON(`${BACKEND_URL}/portfolio`));
      setTransactions(await fetchJSON(`${BACKEND_URL}/transactions`));
    })();
  }, []);

  return (
    <div>
      <h2>Stock Distribution by Units</h2>
      <PieChart labels={portfolio.map(p => p.symbol)} data={portfolio.map(p => p.units)} />

      <h2>Stock Distribution by Value</h2>
      <PieChart labels={portfolio.map(p => p.symbol)} data={portfolio.map(p => p.currentValue)} />

      <h2>Buy/Sell Timeline</h2>
      <LineChart labels={transactions.map(t => t.date)} datasets={portfolio.map(stock => ({
        label: stock.symbol,
        data: transactions.filter(t => t.symbol === stock.symbol).map(t => t.unitsChange)
      }))} />
    </div>
  );
}