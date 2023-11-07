import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

const Hba1cChart = ({ Hba1cRecords }) => {
  const labels = Hba1cRecords.map((record) => {
    const date = new Date(record.timestamp);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  });
  const Hba1cValues = Hba1cRecords.map((record) => record.hba1c);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Hba1c',
        data: Hba1cValues,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'ค่าน้ำตาลในเลือด (%)',
          fontSize: 16,
        },
        ticks: {
          stepSize: 10,
          font: {
            size: 12,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'เดือน/ปี',
          fontSize: 16,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
        legend: {
          display: false,
        },
      },
    };

  return (
    <div className="container chart">
      <h3 className="chart-title">ค่าน้ำตาลในเลือด</h3>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Hba1cChart;
