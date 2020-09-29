// ------------
// bar chart (svg)
// ------------

// useRef -- create reference for our D3 stuff
// useEffect -- execute our D3 code the react way (after DOM is ready)

import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const D3Component = (props) => {
  // ref
  const d3Container = useRef(null);

  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (props.data && d3Container.current) {
      // select (d3Container)
      const svg = d3.select(d3Container.current);
      // svg properties
      const width = 420;
      const x = d3
        .scaleLinear()
        .domain([0, d3.max(props.data)])
        .range([0, width]);
      const y = d3
        .scaleBand()
        .domain(d3.range(props.data.length))
        .range([0, 20 * props.data.length]);
      // update svg
      const updatedSvg = svg
        // style svg
        .attr('width', width)
        .attr('height', y.range()[1])
        .attr('font-family', 'sans-serif')
        .attr('font-size', '10')
        .attr('text-anchor', 'end');

      // clear old 'bar'
      // without this, old/new bars will overlap when data/scale changes.
      const oldBar = updatedSvg.selectAll('g');
      oldBar.remove();

      // update div's children
      const bar = updatedSvg
        .selectAll('g')
        // bind data
        .data(props.data)
        // join selection and data
        .join('g')
        // apply transformation to bars
        .attr('transform', (d, i) => `translate(0,${y(i)})`);
      // add rectangles
      bar
        .append('rect')
        // style rectangles
        .attr('fill', 'steelblue')
        // set dimensions
        .attr('width', x)
        .attr('height', y.bandwidth() - 1);
      // add text
      bar
        .append('text')
        // style text
        .attr('fill', 'white')
        .attr('x', (d) => x(d) - 3)
        .attr('y', () => y.bandwidth() / 2)
        .attr('dy', '0.35em')
        // set text
        .text((d) => d);

      updatedSvg.exit().remove();
    }
  }, [props.data, d3Container.current]);
  // jsx
  return <svg className="d3-component" ref={d3Container} />;
};

const Graph = () => {
  // data
  const [data, setData] = useState([]);
  // random integer
  const randInt = (max) => Math.ceil(Math.random() * Math.floor(max));
  // add random integer to 'data'
  const pushInt = () => {
    const newInt = randInt(10); // 1-10
    setData([...data, newInt]);
  };
  // remove last integer of 'data'
  const popInt = () => {
    const newData = data.slice(0, data.length - 1);
    setData(newData);
  };
  // jsx
  return (
    <div className="my-app">
      <button onClick={pushInt}>+</button>
      <button onClick={popInt}>-</button>
      <br />
      <D3Component data={data} />
    </div>
  );
};

export default Graph;
