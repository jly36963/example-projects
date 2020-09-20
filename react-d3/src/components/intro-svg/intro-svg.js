import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const D3Component = props => {
  // ref
  const d3Container = useRef(null);
  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (props.data && d3Container.current) {
      // select
      const svg = d3.select(d3Container.current);
      // bind d3 data
      const update = svg
        .append("g")
        .selectAll("text")
        .data(props.data)
      // enter new D3 elements
      update
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 25)
        .attr("y", 40)
        .style("font-size", 24)
        .text(d => d);
      // update existing D3 elements
      update
        .attr("x", (d, i) => i * 40)
        .text(d => d);
      // remove old D3 elements
      update
        .exit()
        .remove();
    }
  }, [props.data]);
  // jsx
  return (
    <svg className="d3-component" width={400} height={200} ref={d3Container} />
  );
};

const App = () => {
  return (
    <div>
      <D3Component data={[1, 2, 3, 4, 5, 6, 7]} />
    </div>
  );
};

export default App;