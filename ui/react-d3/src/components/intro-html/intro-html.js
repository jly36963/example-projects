import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const IntroHtml = () => {
  // ref
  const d3Container = useRef(null);
  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    const svg = d3
      .select(d3Container.current)
      .style('background-color', 'steelblue')
      .style('height', '100%')
      .style('min-height', '100px');
  }, []);
  // jsx
  return <div ref={d3Container}></div>;
};

export default IntroHtml;
