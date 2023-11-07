import React, { useState, useEffect } from 'react';
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

const BehaviorRecordsChart = ({ behaviorRecords }) => {
  const [questions, setQuestions] = useState({});
  const [monthlyResponseCounts, setMonthlyResponseCounts] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('A-token');

    async function fetchBehaviorQuestions() {
      try {
        const response = await fetch('http://localhost:3000/api/v1/admin/behaviorForm', {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const questionsMap = {};
          data.forEach(question => {
            questionsMap[question.id] = question.question;
          });
          setQuestions(questionsMap);
        } else {
          console.error('Error fetching behavior data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching behavior data:', error);
      }
    }

    fetchBehaviorQuestions();
  }, []);

  useEffect(() => {
    if (behaviorRecords.length > 0) {
      const recordsByMonth = behaviorRecords.reduce((acc, record) => {
        const timestamp = new Date(record.timestamp);
        const monthYear = `${timestamp.getMonth() + 1}/${timestamp.getFullYear()}`;
        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }
        acc[monthYear].push(record);
        return acc;
      }, {});
  
      const counts = {};
      for (const monthYear in recordsByMonth) {
        const records = recordsByMonth[monthYear];
        counts[monthYear] = {};
  
        records.forEach(record => {
          const questions = record.question; // Assuming record.question is an array
          const responses = record.response; // Assuming record.response is an array
  
          for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const response = responses[i];
  
            if (response === '1') {
              if (!counts[monthYear][question]) {
                counts[monthYear][question] = 0;
              }
              counts[monthYear][question]++;
            }
          }
        });
      }
  
      setMonthlyResponseCounts(counts);
    }
  }, [behaviorRecords]);

  if (behaviorRecords.length === 0) {
    return null;
  }

  function generateColor(questionId, index) {
    const hue = (questionId % 360) + index * 20;
    const saturation = 70;
    const lightness = 70;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  const questionLabels = Object.keys(questions);
  const months = Object.keys(monthlyResponseCounts).map(monthStr => {
    const [month, year] = monthStr.split('/').map(Number);
    return new Date(year, month - 1);
  });

  months.sort((a, b) => a - b);

  const chartData = {
    labels: months.map(date => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${month}/${year}`;
    }),
    datasets: questionLabels.map((questionId, index) => {
      const dataForQuestion = months.map(month => {
        const monthStr = `${month.getMonth() + 1}/${month.getFullYear()}`;
        return (monthlyResponseCounts[monthStr] && monthlyResponseCounts[monthStr][questionId]) || 0;
      });
  
      return {
        label: questions[questionId],
        data: dataForQuestion,
        backgroundColor: generateColor(questionId, index),
        borderColor: generateColor(questionId, index),
        borderWidth: 1,
      };
    }),
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'จำนวนครั้งที่ปฏิบัติ (ครั้ง)',
          fontSize: 16,
        },
        ticks: {
          stepSize: 1,
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
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="container chart">
      <h3 className="chart-title">พฤติกรรม</h3>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BehaviorRecordsChart;
