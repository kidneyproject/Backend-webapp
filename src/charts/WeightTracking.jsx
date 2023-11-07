import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LineController,
  PointElement
} from 'chart.js'
import { Line } from 'react-chartjs-2';
import './chart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const WeightTracking = ({ weightData }) => {
  // Extract weight values and timestamps from the weightData prop
  const weightValues = weightData.map(record => record.weight);
  const labels = weightData.map(record => {
    const date = new Date(record.timestamp);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'น้ำหนัก (กิโลกรัม)',
        data: weightValues,
        fill: false,
        borderColor: 'rgb(143, 188, 226)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(143, 188, 226, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 120,
        title: {
          display: true,
          text: 'น้ำหนัก (กิโลกรัม)',
          fontSize: 16,
        },
        ticks: {
          stepSize: 20,
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
      <h3 className="chart-title">น้ำหนัก</h3>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WeightTracking;
