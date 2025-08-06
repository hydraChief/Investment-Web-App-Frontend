'use client';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ labels, data }) {
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
                label: "Units",
                data,
                backgroundColor: colors,
                borderColor: "#fff",
                borderWidth: 2
            }
        ]
    };

    return <Pie data={chartData} />;
}
