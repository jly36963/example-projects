// package imports
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import * as d3Hexbin from 'd3-hexbin';

// data
import csvStaticFilePath from './density.csv';

// d3 component
const D3Component = ({ data }) => {
  console.log(data);
  // ref
  const d3Container = useRef(null);
  // dimensions
  const margin = { top: 10, right: 30, bottom: 30, left: 40 };
  const width = 460 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (data.length && d3Container.current) {
      // ------------
      // calculate axes
      // ------------

      // scale
      const x = d3.scaleLinear().domain([5, 18]).range([0, width]);
      const y = d3.scaleLinear().domain([5, 20]).range([height, 0]);

      // axis
      // ...

      // geometry
      const inputForHexbinFun = [];
      data.forEach((d) => {
        inputForHexbinFun.push([x(d.x), y(d.y)]); // Note that we had the transform value of X and Y !
      });
      const color = d3
        .scaleLinear()
        .domain([0, 600]) // Number of points in the bin?
        .range(['transparent', '#69b3a2']);

      const hexbin = d3Hexbin
        .hexbin()
        .radius(9) // size of the bin in px
        .extent([
          [0, 0],
          [width, height],
        ]);

      // ------------
      // create d3 container
      // ------------

      const svg = d3
        .select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

      svg.append('g').call(d3.axisLeft(y));

      svg
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

      svg
        .append('g')
        .attr('clip-path', 'url(#clip)')
        .selectAll('path')
        .data(hexbin(inputForHexbinFun))
        .enter()
        .append('path')
        .attr('d', hexbin.hexagon())
        .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')
        .attr('fill', (d) => color(d.length))
        .attr('stroke', 'black')
        .attr('stroke-width', '0.1');
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
        d3.autoType,
      );
      setData(csvData);
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
