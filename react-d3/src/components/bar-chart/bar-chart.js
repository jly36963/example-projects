// package imports
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

// data
import csvStaticFilePath from './alphabet.csv';

// data and example from:
// https://observablehq.com/@d3/line-chart

// d3 component
const D3Component = ({ data }) => {
  console.log(data);
  // ref
  const d3Container = useRef(null);
  // dimensions
  const margin = { top: 30, right: 0, bottom: 30, left: 40 };
  const height = 500;
  const width = 1.4 * height;
  // color
  const color = 'steelblue';

  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (data.length && d3Container.current) {
      // ------------
      // calculate axes
      // ------------

      // scale
      const x = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);
      // axis
      const xAxis = (g) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .tickFormat((i) => data[i].name)
            .tickSizeOuter(0),
        );
      const yAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks(null, '%'))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .append('text')
              .attr('x', -margin.left)
              .attr('y', 10)
              .attr('fill', 'currentColor')
              .attr('text-anchor', 'start')
              .text('↑ Frequency'),
          );

      // geometry
      // ...

      // ------------
      // create d3 container
      // ------------

      const svg = d3
        .select(d3Container.current)
        .attr('viewBox', [0, 0, width, height]);

      svg
        .append('g')
        .attr('fill', color)
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d, i) => x(i))
        .attr('y', (d) => y(d.value))
        .attr('height', (d) => y(0) - y(d.value))
        .attr('width', x.bandwidth());

      svg.append('g').call(xAxis);

      svg.append('g').call(yAxis);

      // svg.exit().remove(); // remove unnecessary data & dom nodes
    }
  }, [data]);
  // jsx
  return (
    <svg
      className="d3-component"
      ref={d3Container}
      width={width}
      height={height}
    />
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
        ({ letter, frequency }) => ({ name: letter, value: +frequency }),
      );
      const sortedCsvData = csvData.sort((a, b) =>
        d3.descending(a.value, b.value),
      ); // , {format: "%", y: "↑ Frequency"})
      setData(sortedCsvData);
    };
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
