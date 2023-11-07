import React from 'react';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(Title, Tooltip, Legend, ArcElement);


const EGFRRangePie = ({ eGFRRecords }) => {
  // Step 1: Group eGFR records by quarter
  const eGFRRangesByQuarter = {};

  eGFRRecords.forEach((record) => {
    const eGFR = record.egfr;
    const timestamp = new Date(record.timestamp);
    const year = timestamp.getUTCFullYear();
    const quarter = Math.floor(timestamp.getUTCMonth() / 3);

    // Create a key for the quarter
    const quarterKey = `${year}-Q${quarter + 1}`;

    // Initialize the quarter data if it doesn't exist
    if (!eGFRRangesByQuarter[quarterKey]) {
      eGFRRangesByQuarter[quarterKey] = {
        '0-14': 0,
        '15-29': 0,
        '30-44': 0,
        '45-59': 0,
        '60-90': 0,
        '90+': 0,
      };
    }

    // Update the counts for the eGFR range
    if (eGFR >= 0 && eGFR <= 14) {
      eGFRRangesByQuarter[quarterKey]['0-14']++;
    } else if (eGFR >= 15 && eGFR <= 29) {
      eGFRRangesByQuarter[quarterKey]['15-29']++;
    } else if (eGFR >= 30 && eGFR <= 44) {
      eGFRRangesByQuarter[quarterKey]['30-44']++;
    } else if (eGFR >= 45 && eGFR <= 59) {
      eGFRRangesByQuarter[quarterKey]['45-59']++;
    } else if (eGFR >= 60 && eGFR <= 90) {
      eGFRRangesByQuarter[quarterKey]['60-90']++;
    } else {
      eGFRRangesByQuarter[quarterKey]['90+']++;
    }
  });

  // Step 3: Render pie charts for each quarter
  const pieCharts = Object.keys(eGFRRangesByQuarter).map((quarterKey) => {
    const labels = Object.keys(eGFRRangesByQuarter[quarterKey]);
    const data = Object.values(eGFRRangesByQuarter[quarterKey]);

    // Define colors for the pie chart segments
    const colors = [
      'rgb(255, 99, 132)',
      'rgb(75, 192, 192)',
      'rgb(255, 205, 86)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
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
      <div key={quarterKey} className="col-sm egfr-pie-chart">
        <h3 className="chart-title">{`eGFR: ${quarterKey}`}</h3>
        <div className="chart-container egfr-pie">
          <Doughnut data={dataForChart} options={options} />
        </div>
      </div>
    );
  });

  return <div className='container chart'><div className='row'>{pieCharts}</div></div>;
};

export default EGFRRangePie;