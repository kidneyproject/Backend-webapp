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

const EGFRChart = ({ eGFRRecords }) => {
  const labels = eGFRRecords.map((record) => {
    const date = new Date(record.timestamp);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  });

  const eGFRValues = eGFRRecords.map((record) => record.egfr);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'eGFR',
        data: eGFRValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
          text: 'อัตราการกรองไต (mg/mmol)',
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
      <h3 className="chart-title">อัตราการกรองไต</h3>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default EGFRChart;
