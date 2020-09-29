// package imports
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

// data
import csvStaticFilePath from './iris-data.csv';

// data and example from:
// https://www.d3-graph-gallery.com/graph/violin_basicHist.html

// d3 component
const D3Component = ({ data }) => {
  console.log(data);
  // ref
  const d3Container = useRef(null);
  // dimensions
  const margin = { top: 10, right: 30, bottom: 30, left: 40 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // manipulate the DOM the react way (after component is mounted)
  useEffect(() => {
    if (data.length && d3Container.current) {
      // ------------
      // calculate axes
      // ------------

      // helper functions

      // scale
      const y = d3
        .scaleLinear()
        .domain([3.5, 8]) // Note that here the Y scale is set manually
        .range([height, 0]);

      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(['setosa', 'versicolor', 'virginica'])
        .padding(0.05); // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.

      // axis
      // ...

      // geometry

      const histogram = d3
        .histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20)) // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value((d) => d);

      // Compute the binning for each group of the dataset
      const sumstat = d3
        .nest() // nest function allows to group the calculation per level of a factor
        .key((d) => d.Species)
        .rollup((d) => {
          // For each key..
          const input = d.map((g) => g.Sepal_Length); // Keep the variable called Sepal_Length
          const bins = histogram(input); // And compute the binning on it.
          return bins;
        })
        .entries(data);

      // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
      let maxNum = 0;
      for (const i in sumstat) {
        console.log('i', i);
        const allBins = sumstat[i].value;
        const lengths = allBins.map(function (a) {
          return a.length;
        });
        const longest = d3.max(lengths);
        if (longest > maxNum) {
          maxNum = longest;
        }
      }

      // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
      const xNum = d3
        .scaleLinear()
        .range([0, x.bandwidth()])
        .domain([-maxNum, maxNum]);

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

      svg.append('g').call(d3.axisLeft(y));

      svg
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

      svg
        .selectAll('myViolin')
        .data(sumstat)
        .enter() // So now we are working group per group
        .append('g')
        .attr('transform', function (d) {
          return 'translate(' + x(d.key) + ' ,0)';
        }) // Translation on the right to be at the group position
        .append('path')
        .datum(function (d) {
          return d.value;
        }) // So now we are working bin per bin
        .style('stroke', 'none')
        .style('fill', '#69b3a2')
        .attr(
          'd',
          d3
            .area()
            .x0(function (d) {
              return xNum(-d.length);
            })
            .x1(function (d) {
              return xNum(d.length);
            })
            .y(function (d) {
              return y(d.x0);
            })
            .curve(d3.curveCatmullRom), // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
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
