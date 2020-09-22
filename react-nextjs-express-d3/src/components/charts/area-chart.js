// package imports
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import FlexContainer from '../flex-container';
import PaddedPaper from '../padded-paper';

// data and example from:
// https://observablehq.com/@d3/area-chart

// d3 component
const AreaChart = ({ data }) => {
  // ref
  const d3Container = useRef(null);
  // dimensions
  const margin = { top: 20, right: 20, bottom: 30, left: 30 };
  const height = 450;
  const width = 1.4 * height;

  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (data.length && d3Container.current) {
      // ------------
      // calculate axes
      // ------------

      // scale
      const x = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => d.date))
        .range([margin.left, width - margin.right]);
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
      const curve = d3.curveLinear;
      const area = d3
        .area()
        .curve(curve)
        .x((d) => x(d.date))
        .y0(y(0))
        .y1((d) => y(d.value));

      // ------------
      // create d3 container
      // ------------

      const svg = d3.select(d3Container.current).attr('viewBox', [0, 0, width, height]);

      svg.append('path').datum(data).attr('fill', 'steelblue').attr('d', area);

      svg.append('g').call(xAxis);

      svg.append('g').call(yAxis);
    }
  }, [data]);
  // jsx
  return (
    <FlexContainer>
      <PaddedPaper elevation={3}>
        <svg className="d3-component" ref={d3Container} width={width} height={height} />
      </PaddedPaper>
    </FlexContainer>
  );
};

export default AreaChart;
