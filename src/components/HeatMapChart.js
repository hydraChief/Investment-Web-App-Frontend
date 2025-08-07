"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  MatrixController,
  MatrixElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function HeatmapChart({ transactions }) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return <div>No data available</div>;
  }

  const labelsX = [
    ...new Set(
      transactions.map(t =>
        new Date(t.transaction_date).toLocaleDateString("en-GB")
      )
    )
  ];
  const labelsY = [...new Set(transactions.map(t => t.company_name))];

  const heatmapData = transactions.map(t => ({
    x: new Date(t.transaction_date).toLocaleDateString("en-GB"),
    y: t.company_name,
    v: Number(t.total_units) || 0
  }));

  const dataset = {
    label: "Units Activity",
    data: heatmapData,
    backgroundColor(ctx) {
      const point = ctx.dataset.data[ctx.dataIndex];
      const value = point?.v ?? 0;
      const alpha = Math.min(1, Math.abs(value) / 500); // adjust scaling
      return value >= 0
        ? `rgba(0, 200, 0, ${alpha})`
        : `rgba(200, 0, 0, ${alpha})`;
    },
    borderWidth: 1,
    width: ({ chart }) => (chart.chartArea.width / labelsX.length) - 4,
    height: ({ chart }) => (chart.chartArea.height / labelsY.length) - 4
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Chart
        type="matrix"
        data={{ datasets: [dataset] }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                title: ctx => `Date: ${ctx[0].raw.x}`,
                label: ctx => `Company: ${ctx.raw.y}, Units: ${ctx.raw.v}`
              }
            }
          },
          scales: {
            x: {
              type: "category",
              labels: labelsX,
              title: { display: true, text: "Date" },
              grid: { display: false }
            },
            y: {
              type: "category",
              labels: labelsY,
              title: { display: true, text: "Company" },
              grid: { display: false }
            }
          }
        }}
      />
    </div>
  );
}
