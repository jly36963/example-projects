// package imports
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

// data
import csvStaticFilePath from './population-by-age.csv';

// data and example from:
// https://observablehq.com/@d3/line-chart

// d3 component
const D3Component = ({ data }) => {
  console.log(data);
  // ref
  const d3Container = useRef(null);
  // dimensions
  const height = 500;
  const width = 1.4 * height;

  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (data.length && d3Container.current) {
      // ------------
      // calculate axes
      // ------------

      // scale
      // ...

      // axis
      // ...

      // geometry
      const arc = (() => {
        const radius = Math.min(width, height) / 2;
        return d3
          .arc()
          .innerRadius(radius * 0.67)
          .outerRadius(radius - 1);
      })();
      const pie = d3
        .pie()
        .padAngle(0.005)
        .sort(null)
        .value((d) => d.value);
      const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.name))
        .range(
          d3
            .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
            .reverse(),
        );

      // ------------
      // create d3 container
      // ------------

      const arcs = pie(data);

      const svg = d3
        .select(d3Container.current)
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

      svg
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', (d) => color(d.data.name))
        .attr('d', arc)
        .append('title')
        .text((d) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

      svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .selectAll('text')
        .data(arcs)
        .join('text')
        .attr('transform', (d) => `translate(${arc.centroid(d)})`)
        .call((text) =>
          text
            .append('tspan')
            .attr('y', '-0.4em')
            .attr('font-weight', 'bold')
            .text((d) => d.data.name),
        )
        .call((text) =>
          text
            .filter((d) => d.endAngle - d.startAngle > 0.25)
            .append('tspan')
            .attr('x', 0)
            .attr('y', '0.7em')
            .attr('fill-opacity', 0.7)
            .text((d) => d.data.value.toLocaleString()),
        );

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
