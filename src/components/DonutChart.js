'use client';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart({ portfolio }) {
  const colors = portfolio.map(() =>
    `hsl(${Math.random() * 360}, 70%, 70%)`
  );

  return (
    <Doughnut
      data={{
        labels: portfolio.map(p => `${p.company_name} (${p.full_company_name})`),
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
