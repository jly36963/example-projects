import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';

const ChartComponent = ({ data }) => {
  // ref
  const chartRef = useRef(null);
  // manipulate the DOM the react way
  useEffect(() => {
    if (data && chartRef.current) {
      const chartContainer = chartRef.current.getContext('2d');
      new Chart(chartContainer, {
        type: 'doughnut',
        data,
        options: {
          // custom config
          title: {
            display: true,
            text: 'Predicted world population (millions) in 2050',
          },
        },
      });
    }
  }, [data]);
  return (
    <div>
      <canvas id="line-chart" ref={chartRef} width="800" height="450" />
    </div>
  );
};

const App = () => {
  const [data, setData] = useState({
    labels: ['Africa', 'Asia', 'Europe', 'Latin America', 'North America'],
    datasets: [
      {
        label: 'Population (millions)',
        backgroundColor: [
          '#3e95cd',
          '#8e5ea2',
          '#3cba9f',
          '#e8c3b9',
          '#c45850',
        ],
        data: [2478, 5267, 734, 784, 433],
      },
    ],
  });
  return (
    <div>
      <ChartComponent data={data} />
    </div>
  );
};

export default App;
