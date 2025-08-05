'use client';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StackedColumnChart({ data }) {
  const labels = [...new Set(data.map(d => new Date(d.transaction_date).toLocaleDateString()))];
  const companies = [...new Set(data.map(d => d.company_name))];

  const datasets = companies.flatMap(company => {
    const companyData = data.filter(d => d.company_name === company);
    return [
      {
        label: `${company} Buy`,
        data: labels.map(date =>
          companyData.find(d => d.type === "buy" && new Date(d.transaction_date).toLocaleDateString() === date)?.total_amount || 0
        ),
        backgroundColor: "rgba(0, 200, 0, 0.7)",
        stack: company
      },
      {
        label: `${company} Sell`,
        data: labels.map(date =>
          companyData.find(d => d.type === "sell" && new Date(d.transaction_date).toLocaleDateString() === date)?.total_amount || 0
        ),
        backgroundColor: "rgba(200, 0, 0, 0.7)",
        stack: company
      }
    ];
  });

  return (
    <Bar
      data={{ labels, datasets }}
      options={{
        responsive: true,
        plugins: { title: { display: true, text: "Stacked Buy vs Sell Amount" } },
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
      }}
    />
  );
}
