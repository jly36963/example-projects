// package imports
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import FlexContainer from '../flex-container';
import PaddedPaper from '../padded-paper';

// data and example from:
// https://observablehq.com/@d3/line-chart

// d3 component
const BarChartH = ({ data }) => {
  // ref
  const d3Container = useRef(null);
  // dimensions
  const barHeight = 25;
  const margin = { top: 30, right: 0, bottom: 30, left: 30 };
  const height = Math.ceil((data.length + 0.1) * barHeight) + margin.top + margin.bottom;
  const width = height;

  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (data.length && d3Container.current) {
      // ------------
      // calculate axes
      // ------------

      // scale
      const x = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .range([margin.left, width - margin.right]);
      const y = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .rangeRound([margin.top, height - margin.bottom])
        .padding(0.1);
      // axis
      const xAxis = (g) =>
        g
          .attr('transform', `translate(0,${margin.top})`)
          .call(d3.axisTop(x).ticks(width / 80, '%'))
          .call((g) => g.select('.domain').remove());
      const yAxis = (g) =>
        g.attr('transform', `translate(${margin.left},0)`).call(
          d3
            .axisLeft(y)
            .tickFormat((i) => data[i].name)
            .tickSizeOuter(0),
        );

      // geometry
      const format = x.tickFormat(20, '%');
      // ...

      // ------------
      // create d3 container
      // ------------

      const svg = d3.select(d3Container.current).attr('viewBox', [0, 0, width, height]);

      svg
        .append('g')
        .attr('fill', 'steelblue')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', x(0))
        .attr('y', (d, i) => y(i))
        .attr('width', (d) => x(d.value) - x(0))
        .attr('height', y.bandwidth());

      svg
        .append('g')
        .attr('fill', 'white')
        .attr('text-anchor', 'end')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', (d) => x(d.value) - 4)
        .attr('y', (d, i) => y(i) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .text((d) => format(d.value));

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

export default BarChartH;
