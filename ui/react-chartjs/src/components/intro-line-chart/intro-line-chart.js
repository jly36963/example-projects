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
        type: 'line',
        data,
        options: {
          // custom config
        },
      });
    }
  }, [data]);
  // jsx
  return (
    <div>
      <canvas id="intro-line-graph" ref={chartRef} width="800" height="450" />
    </div>
  );
};

const App = () => {
  const [data, setData] = useState({
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Sales',
        backgroundColor: ['#3e95ff77'],
        data: [86, 67, 91, 50, 80, 76, 68, 90, 77, 65, 83, 80],
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
