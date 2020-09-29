// package imports
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

// data
import tsvStaticFilePath from './unemployment.tsv';

// redefine d3.least since it was removed in version 5.x (for whatever reason)
const ascending = (a, b) => (a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN);
const d3Least = (values, compare = ascending) => {
  let min;
  let defined = false;
  if (compare.length === 1) {
    let minValue;
    for (const element of values) {
      const value = compare(element);
      if (
        defined ? ascending(value, minValue) < 0 : ascending(value, value) === 0
      ) {
        min = element;
        minValue = value;
        defined = true;
      }
    }
  } else {
    for (const value of values) {
      if (defined ? compare(value, min) < 0 : compare(value, value) === 0) {
        min = value;
        defined = true;
      }
    }
  }
  return min;
};

// d3 component
const D3Component = ({ data }) => {
  // ref
  const d3Container = useRef(null);
  // dimensions
  const margin = { top: 20, right: 20, bottom: 30, left: 30 };
  const height = 500;
  const width = 1.6 * height;

  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (data && Object.keys(data).length && d3Container.current) {
      // ------------
      // calculate axes
      // ------------

      // scale
      const x = d3
        .scaleUtc()
        .domain(d3.extent(data.dates))
        .range([margin.left, width - margin.right]);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data.series, (d) => d3.max(d.values))])
        .nice()
        .range([height - margin.bottom, margin.top]);
      // axis
      const xAxis = (g) =>
        g.attr('transform', `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0),
        );
      const yAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .select('.tick:last-of-type text')
              .clone()
              .attr('x', 3)
              .attr('text-anchor', 'start')
              .attr('font-weight', 'bold')
              .text('$ Close'),
          );

      // geometry
      const line = d3
        .line()
        .defined((d) => !isNaN(d))
        .x((d, i) => x(data.dates[i]))
        .y((d) => y(d));

      // ------------
      // event handlers
      // ------------

      const hover = (svg, path) => {
        // handlers
        const moved = () => {
          d3.event.preventDefault();
          const ym = y.invert(d3.event.layerY);
          const xm = x.invert(d3.event.layerX);
          // console.log("moved -> ym", ym)
          // console.log("moved -> xm", xm)
          const i1 = d3.bisectLeft(data.dates, xm, 1);
          const i0 = i1 - 1;
          const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
          const s = d3Least(data.series, (d) => Math.abs(d.values[i] - ym));
          path
            .attr('stroke', (d) => (d === s ? null : '#ddd'))
            .filter((d) => d === s)
            .raise();
          dot.attr(
            'transform',
            `translate(${x(data.dates[i])},${y(s.values[i])})`,
          );
          dot.select('text').text(s.name);
        };
        const entered = () => {
          path.style('mix-blend-mode', null).attr('stroke', '#ddd');
          dot.attr('display', null);
        };
        const left = () => {
          path.style('mix-blend-mode', 'multiply').attr('stroke', null);
          dot.attr('display', 'none');
        };

        // execute handlers
        if ('ontouchstart' in document)
          svg
            .style('-webkit-tap-highlight-color', 'transparent')
            .on('touchmove', moved)
            .on('touchstart', entered)
            .on('touchend', left);
        else
          svg
            .on('mousemove', moved)
            .on('mouseenter', entered)
            .on('mouseleave', left);

        const dot = svg.append('g').attr('display', 'none');

        dot.append('circle').attr('r', 2.5);

        dot
          .append('text')
          .attr('font-family', 'sans-serif')
          .attr('font-size', 10)
          .attr('text-anchor', 'middle')
          .attr('y', -8);
      };

      // ------------
      // create d3 container
      // ------------

      const svg = d3
        .select(d3Container.current)
        .attr('viewBox', [0, 0, width, height])
        .style('overflow', 'visible');

      svg.append('g').call(xAxis);

      svg.append('g').call(yAxis);

      const path = svg
        .append('g')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .selectAll('path')
        .data(data.series)
        .join('path')
        .style('mix-blend-mode', 'multiply')
        .attr('d', (d) => line(d.values));

      svg.call(hover, path);
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
  const [data, setData] = useState(null);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const tsvFile = await fetch(tsvStaticFilePath); // tsv file
      const tsvText = await tsvFile.text(); // tsv as string
      const tsvData = d3.tsvParse(tsvText);
      const columns = tsvData.columns.slice(1);
      const formattedTsvData = {
        y: '% Unemployment',
        series: tsvData.map((d) => ({
          name: d.name.replace(/, ([\w-]+).*/, ' $1'),
          values: columns.map((k) => +d[k]),
        })),
        dates: columns.map(d3.utcParse('%Y-%m')),
      };
      setData(formattedTsvData);
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
