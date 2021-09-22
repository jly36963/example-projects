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
        type: 'radar',
        data,
        options: {
          // custom config
          title: {
            display: true,
            text: 'Distribution in % of world population',
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
        label: '1950',
        fill: true,
        backgroundColor: 'rgba(179,181,198,0.2)',
        borderColor: 'rgba(179,181,198,1)',
        pointBorderColor: '#fff',
        pointBackgroundColor: 'rgba(179,181,198,1)',
        data: [8.77, 55.61, 21.69, 6.62, 6.82],
      },
      {
        label: '2050',
        fill: true,
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        pointBorderColor: '#fff',
        pointBackgroundColor: 'rgba(255,99,132,1)',
        pointBorderColor: '#fff',
        data: [25.48, 54.16, 7.61, 8.06, 4.45],
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
