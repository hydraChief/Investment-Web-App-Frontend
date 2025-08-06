'use client';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StackedColumnChart({ data,type='stocks' }) {
  const labels = [...new Set(data.map(d => new Date(d.transaction_date).toLocaleDateString()))];
  let companies = [...new Set(data.map(d => d.company_name))];

  if (type === 'bonds') {
    companies = [...new Set(data.map(d => d.bond_name))];
  } else if (type === 'precious_metals') {  
    companies = [...new Set(data.map(d => d.metal_name))];
  }

  const datasets = companies.flatMap(company => {
    let companyData = data.filter(d => d.company_name === company);
    if (type === 'bonds') {
      companyData = data.filter(d => d.bond_name === company);
    } else if (type === 'precious_metals') {
      companyData = data.filter(d => d.metal_name === company);
    }
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
