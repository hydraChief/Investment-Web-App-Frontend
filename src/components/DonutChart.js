'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ portfolio, type = 'stocks' }) {
  const colors = portfolio.map(() =>
    `hsl(${Math.random() * 360}, 70%, 70%)`
  );
  let labelsData = portfolio.map(p => `${p.company_name} (${p.full_company_name})`);
  if (type === 'bonds') {
    labelsData = portfolio.map(p => `${p.bond_name} (${p.bond_symbol})`);
  }
  else if (type === 'precious_metals') {
    labelsData = portfolio.map(p => `${p.metal_name} (${p.metal_symbol})`);
  }else if (type === 'allByName') {
    labelsData = portfolio.map(p => `${p.name}`);
  }else if (type === 'allByCategory') {
    labelsData = portfolio.map(p => `${p.name}`);
  }
  return (
    <Doughnut
      data={{
        labels: labelsData,
        datasets: [
          {
            data: portfolio.map(p => p.total_amount),
            backgroundColor: colors
          }
        ]
      }}
      options={{
        plugins: {
          title: { display: true, text: "Portfolio Composition" }
        }
      }}
    />
  );
}
