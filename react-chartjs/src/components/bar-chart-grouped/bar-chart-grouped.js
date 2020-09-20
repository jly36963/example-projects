import React, { useRef, useEffect, useState } from 'react';
import Chart from "chart.js";

const ChartComponent = ({ data }) => {
  // ref
  const chartRef = useRef(null);
  // manipulate the DOM the react way
  useEffect(() => {
    if (data && chartRef.current) {
      const chartContainer = chartRef.current.getContext("2d");
      new Chart(chartContainer, {
        type: "bar",
        data,
        options: {
          // custom config
          legend: { display: false },
          title: {
            display: true,
            text: 'Population growth (millions)'
          }
        }
      })
    }
  }, [data]);
  return (
    <div>
      <canvas id="bar-chart" ref={chartRef} width="800" height="450" />
    </div>
  )
}


const App = () => {
  const [data, setData] = useState({
    labels: ["1900", "1950", "1999", "2050"],
    datasets: [
      {
        label: "Africa",
        backgroundColor: "#3e95cd",
        data: [133, 221, 783, 2478]
      }, {
        label: "Europe",
        backgroundColor: "#8e5ea2",
        data: [408, 547, 675, 734]
      }
    ]
  })
  return (
    <div>
      <ChartComponent data={data} />
    </div>
  )
}

export default App;