
// ------------
// bar chart (html)
// ------------

// useRef -- create reference for our D3 stuff
// useEffect -- execute our D3 code the react way (after DOM is ready)

import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

const D3Component = props => {
  // ref
  const d3Container = useRef(null);
  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (props.data && d3Container.current) {
      // select (d3Container)
      const div = d3.select(d3Container.current);
      // update div
      const updatedDiv = div
        // style container
        .style("font", "10px sans-serif")
        .style("text-align", "right")
        .style("color", "white");
      // update div's children
      updatedDiv
        .selectAll("div")
        // bind data
        .data(props.data)
        // join selection and data
        .join("div")
        // apply styles to the bars
        .style("background", "steelblue")
        .style("padding", "3px")
        .style("margin", "1px")
        // set width (based on data)
        .style("width", d => `${d * 10}px`)
        // set text (based on data)
        .text(d => d);
      // remove unnecessary nodes
      updatedDiv.exit().remove();
    }
  }, [props.data]);
  // jsx
  return (
    <div className="d3-component" width={400} height={300} ref={d3Container} />
  );
};

const App = () => {
  // data
  const [data, setData] = useState([]);
  // random integer
  const randInt = max => Math.ceil(Math.random() * Math.floor(max));
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
      <D3Component data={data} />
    </div>
  );
};

export default App;