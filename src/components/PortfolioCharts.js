"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { TreemapController, TreemapElement } from "chartjs-chart-treemap";
import { Chart } from "react-chartjs-2";

// Register chart types
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TreemapController,
  TreemapElement
);

export default function PortfolioCharts({ data }) {
  const labels = [...new Set(data.map(d =>
    new Date(d.transaction_date).toLocaleDateString()
  ))];

  const companies = [...new Set(data.map(d => d.company_name))];

  const lineDatasets = companies.flatMap(company => {
    const companyData = data.filter(d => d.company_name === company);
    return [
      {
        label: `${company} Buy Units`,
        data: labels.map(date => {
          const entry = companyData.find(
            d => new Date(d.transaction_date).toLocaleDateString() === date && d.type === "buy"
          );
          return entry ? Number(entry.total_units) : 0;
        }),
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.3)",
        fill: false,
        tension: 0.3
      },
      {
        label: `${company} Sell Units`,
        data: labels.map(date => {
          const entry = companyData.find(
            d => new Date(d.transaction_date).toLocaleDateString() === date && d.type === "sell"
          );
          return entry ? Number(entry.total_units) : 0;
        }),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.3)",
        fill: false,
        tension: 0.3
      }
    ];
  });

  const barDatasets = companies.flatMap(company => {
    const companyData = data.filter(d => d.company_name === company);
    return [
      {
        label: `${company} Buy Amount`,
        data: labels.map(date => {
          const entry = companyData.find(
            d => new Date(d.transaction_date).toLocaleDateString() === date && d.type === "buy"
          );
          return entry ? Number(entry.total_amount) : 0;
        }),
        backgroundColor: "rgba(0, 255, 0, 0.5)"
      },
      {
        label: `${company} Sell Amount`,
        data: labels.map(date => {
          const entry = companyData.find(
            d => new Date(d.transaction_date).toLocaleDateString() === date && d.type === "sell"
          );
          return entry ? Number(entry.total_amount) : 0;
        }),
        backgroundColor: "rgba(255, 0, 0, 0.5)"
      }
    ];
  });

  // Prepare Treemap data
  const treemapData = companies.map(company => {
    const totalAmount = data
      .filter(d => d.company_name === company)
      .reduce((sum, row) => sum + Number(row.total_amount), 0);
    return { company, totalAmount };
  });

  const treemapChartData = {
    datasets: [{
      tree: treemapData.map(item => ({ x: item.company, v: item.totalAmount })),
      key: 'v',
      groups: ['x'],
      backgroundColor(ctx) {
        const colors = [
          'rgba(173, 216, 230, 0.7)',
          'rgba(144, 238, 144, 0.7)',
          'rgba(255, 182, 193, 0.7)',
          'rgba(255, 255, 224, 0.7)',
          'rgba(221, 160, 221, 0.7)'
        ];
        return colors[ctx.index % colors.length];
      },
      labels: {
        display: true,
        formatter(ctx) {
          const item = ctx.raw;
          return `${item.x}\n$${item.v.toLocaleString()}`;
        }
      }
    }]
  };

  const treemapOptions = {
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Portfolio Treemap (by Total Amount)" }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      <div>
        <h3>Units Bought & Sold Over Time</h3>
        <Line
          data={{ labels, datasets: lineDatasets }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: { y: { beginAtZero: true } }
          }}
        />
      </div>
      <div>
        <h3>Amounts Bought & Sold Over Time</h3>
        <Bar
          data={{ labels, datasets: barDatasets }}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: { y: { beginAtZero: true } }
          }}
        />
      </div>
      <div>
        <Chart type="treemap" data={treemapChartData} options={treemapOptions} />
      </div>
    </div>
  );
}
