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
} from 'chart.js'
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
)

const BloodPressureInsights = ({ bloodPressureData }) => {
  // Extract systolic and diastolic values and timestamps from the bloodPressureData prop
  const systolicValues = bloodPressureData
    .map(record => record.systolic);

  const diastolicValues = bloodPressureData
    .map(record => record.diastolic);
  
  // Extract timestamps and format them as 'Month Year'
  const labels = bloodPressureData
  .map(record => {
    const date = new Date(record.timestamp);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getFullYear()
      .toString()
      .slice(-2)}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'ซิสโตลิก (mmHg)',
        data: systolicValues,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'ไดแอสโตลิก (mmHg)',
        data: diastolicValues,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
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
        max: 160,
        title: {
          display: true,
          text: 'ความดันโลหิต (mmHg)',
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
          text: 'วัน/เดือน/ปี, เวลา',
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
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className='container chart'>
      <h3 className="chart-title">ความดันโลหิต</h3>
      <div className="chart-container">
        <Line id="chart" data={data} options={options} />
      </div>
    </div>
  );
};

export default BloodPressureInsights;