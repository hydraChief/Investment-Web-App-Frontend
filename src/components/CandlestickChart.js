'use client';
import {
  Chart as ChartJS,
  LinearScale,
  TimeScale
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';

ChartJS.register(LinearScale, TimeScale, CandlestickController, CandlestickElement);

export default function CandlestickChart({ data, label }) {
  const sortedData = data.map(d => ({
    ...d,
    x: new Date(d.x)
  })).sort((a, b) => a.x - b.x);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Chart
        type="candlestick"
        data={{
          datasets: [{
            label,
            data: sortedData,
            barThickness: 6,
            color: { up: 'green', down: 'red', unchanged: 'gray' }
          }]
        }}
        options={{
          parsing: false,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: { unit: 'month', tooltipFormat: 'MMM d' },
              ticks: {
                display: true,
                color: '#000',
                callback: (val) => format(new Date(val), 'MMM d')
              },
              grid: {
                display: true,
                drawTicks: true
              },
              title: { display: true, text: 'Date' }
            },
            y: {
              title: { display: true, text: 'Price (USD)' },
              grid: { display: true },
              ticks: { color: '#000' }
            }
          }
        }}
      />
    </div>
  );
}
