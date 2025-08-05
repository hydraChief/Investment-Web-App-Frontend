"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ labels, data }) {
  const colors = labels.map(() => {
    const r = Math.floor(200 + Math.random() * 55);
    const g = Math.floor(200 + Math.random() * 55);
    const b = Math.floor(200 + Math.random() * 55);
    return `rgb(${r}, ${g}, ${b})`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Amount",
        data,
        backgroundColor: colors
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Portfolio by Total Amount" }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return <Bar data={chartData} options={options} />;
}
