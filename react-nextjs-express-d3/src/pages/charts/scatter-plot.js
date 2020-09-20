// package imports
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import ScatterPlot from "../../components/charts/scatter-plot";

// data fp
const csvStaticFilePath = "/data/iris.csv";

// component
const ScatterPlotPage = () => {
  // data
  const [data, setData] = useState([]);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const csvFile = await fetch(csvStaticFilePath); // csv with 2 columns
      const csvText = await csvFile.text(); // csv as string
      const csvData = d3.csvParse(
        csvText, // csv string to parse
        d3.autoType // callback
      );
      setData(csvData);
    };
    getData();
  }, []);
  // jsx
  return (
    <div>
      <ScatterPlot data={data} />
    </div>
  );
};

export default ScatterPlotPage;
