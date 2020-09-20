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
          title: {
            display: true,
            text: 'Population growth (millions): Europe & Africa'
          },
          legend: { display: false }
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
    datasets: [{
      label: "Europe",
      type: "line",
      borderColor: "#8e5ea2",
      data: [408, 547, 675, 734],
      fill: false
    }, {
      label: "Africa",
      type: "line",
      borderColor: "#3e95cd",
      data: [133, 221, 783, 2478],
      fill: false
    }, {
      label: "Europe",
      type: "bar",
      backgroundColor: "rgba(0,0,0,0.2)",
      data: [408, 547, 675, 734],
    }, {
      label: "Africa",
      type: "bar",
      backgroundColor: "rgba(0,0,0,0.2)",
      backgroundColorHover: "#3e95cd",
      data: [133, 221, 783, 2478]
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