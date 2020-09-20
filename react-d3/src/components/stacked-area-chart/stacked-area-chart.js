// package imports
import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

// data
import csvStaticFilePath from './unemployment-2.csv';

// d3 component
const D3Component = ({ data }) => {
  console.log(data);
  // ref
  const d3Container = useRef(null);
  // dimensions
  const margin = ({ top: 20, right: 30, bottom: 30, left: 40 })
  const height = 500;
  const width = 1.8 * height;
  // format
  const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (data.length && d3Container.current) {

      // series
      const series = d3.stack().keys(data.columns.slice(1))(data)
      // color
      const color = d3.scaleOrdinal()
        .domain(data.columns.slice(1))
        .range(d3.schemeCategory10)

      // ------------
      // calculate axes
      // ------------

      // scale
      const x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right])
      const y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
        .range([height - margin.bottom, margin.top])
      // axis
      const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
      const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Unemployment"))

      // geometry
      const area = d3.area()
        .x(d => x(d.data.date))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))

      // ------------
      // create d3 container
      // ------------

      const svg = d3.select(d3Container.current)
        .attr("viewBox", [0, 0, width, height]);

      svg.append("g")
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ({ key }) => color(key))
        .attr("d", area)
        .append("title")
        .text(({ key }) => key);

      svg.append("g")
        .call(xAxis);

      svg.append("g")
        .call(yAxis);


      // svg.exit().remove(); // remove unnecessary data & dom nodes
    }
  }, [data]);
  // jsx
  return (
    <svg className="d3-component" ref={d3Container} width={width} height={height} />
  );
};

// main component
const App = () => {
  // data
  const [data, setData] = useState([]);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const csvFile = await fetch(csvStaticFilePath); // csv with 2 columns
      const csvText = await csvFile.text(); // csv as string
      const csvData = d3.csvParse(
        csvText, // csv string to parse
        (d, i, columns) => (d3.autoType(d), d.total = d3.sum(columns, c => d[c]), d)
      );
      const sortedCsvData = csvData.sort((a, b) => b.total - a.total)
      setData(sortedCsvData);
    }
    getData();
  }, []);
  // jsx
  return (
    <div>
      <D3Component data={data} />
    </div>
  );
};

export default App;