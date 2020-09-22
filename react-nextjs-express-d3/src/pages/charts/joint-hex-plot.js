// package imports
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import JointHexPlot from '../../components/charts/joint-hex-plot';

// data fp
const csvStaticFilePath = '/data/density.csv';

// component
const JointHexPlotPage = () => {
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
      <JointHexPlot data={data} />
    </div>
  );
};

export default JointHexPlotPage;
