// package imports
import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

// data
import csvStaticFilePath from './us-population-state-age.csv';

// data and example from:
// https://observablehq.com/@d3/stacked-bar-chart

// d3 component
const D3Component = ({ data }) => {
  console.log(data);
  // ref
  const d3Container = useRef(null);
  // dimensions
  const margin = ({ top: 30, right: 10, bottom: 0, left: 30 })
  const height = data.length * 25 + margin.top + margin.bottom;
  const width = 0.8 * height;
  // format
  const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")
  const formatPercent = d3.format(".1%");

  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (data.length && d3Container.current) {

      // series
      const series = d3.stack()
        .keys(data.columns.slice(1))
        .offset(d3.stackOffsetExpand)(data)
        .map(d => (d.forEach(v => v.key = d.key), d))
      // color
      const color = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(d3.schemeSpectral[series.length])
        .unknown("#ccc")

      // ------------
      // calculate axes
      // ------------

      // scale
      const x = d3.scaleLinear()
        .range([margin.left, width - margin.right])
      const y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.top, height - margin.bottom])
        .padding(0.08)
      // axis
      const xAxis = g => g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 100, "%"))
        .call(g => g.selectAll(".domain").remove())
      const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSizeOuter(0))
        .call(g => g.selectAll(".domain").remove())

      // geometry
      // ... 

      // ------------
      // create d3 container
      // ------------

      const svg = d3.select(d3Container.current)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible");

      svg.append("g")
        .selectAll("g")
        .data(series)
        .enter().append("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d[0]))
        .attr("y", (d, i) => y(d.data.name))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())
        .append("title")
        .text(d => `${d.data.name} ${d.key} ${formatPercent(d[1] - d[0])} (${formatValue(d.data[d.key])})`);

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
      const sortedCsvData = csvData.sort((a, b) => b["<10"] / b.total - a["<10"] / a.total)
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