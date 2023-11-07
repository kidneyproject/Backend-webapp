import React from 'react';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(Title, Tooltip, Legend, ArcElement);


const HbA1cPieChart = ({ hba1cRecords }) => {
  // Step 1: Group HbA1c records by quarter
  const hba1cRangesByQuarter = {};

  hba1cRecords.forEach((record) => {
    const hba1c = record.hba1c;
    const timestamp = new Date(record.timestamp);
    const year = timestamp.getUTCFullYear();
    const quarter = Math.floor(timestamp.getUTCMonth() / 3); // 0, 1, 2 for Q1, Q2, Q3

    // Create a key for the quarter
    const quarterKey = `${year}-Q${quarter + 1}`;

    // Initialize the quarter data if it doesn't exist
    if (!hba1cRangesByQuarter[quarterKey]) {
      hba1cRangesByQuarter[quarterKey] = {
        '<5.7%': 0,
        '5.7-6.4%': 0,
        '6.4-7%': 0,
        '7-8%': 0,
        '>8%': 0,
      };
    }

    // Update the counts for the HbA1c range
    if (hba1c < 5.7) {
      hba1cRangesByQuarter[quarterKey]['<5.7%']++;
    } else if (hba1c >= 5.7 && hba1c <= 6.4) {
      hba1cRangesByQuarter[quarterKey]['5.7-6.4%']++;
    } else if (hba1c >= 6.4 && hba1c < 7) {
      hba1cRangesByQuarter[quarterKey]['6.4-7%']++;
    } else if (hba1c >= 7 && hba1c < 8) {
      hba1cRangesByQuarter[quarterKey]['7-8%']++;
    } else {
      hba1cRangesByQuarter[quarterKey]['>8%']++;
    }
  });

  // Step 3: Render pie charts for each quarter
  const pieCharts = Object.keys(hba1cRangesByQuarter).map((quarterKey) => {
    const labels = Object.keys(hba1cRangesByQuarter[quarterKey]);
    const data = Object.values(hba1cRangesByQuarter[quarterKey]);

    // Define colors for the pie chart segments
    const colors = [
      'rgb(255, 99, 132)',
      'rgb(75, 192, 192)',
      'rgb(255, 205, 86)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
    ];

    const dataForChart = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
    };

    return (
      <div key={quarterKey} className="col-sm">
        <h3 className="chart-title">{`Hba1c: ${quarterKey}`}</h3>
        <div className="chart-container Hba1c-pie">
          <Doughnut data={dataForChart} options={options} />
        </div>
      </div>
    );
  });

  return <div className='container chart'><div className='row'>{pieCharts}</div></div>;
};

export default HbA1cPieChart;