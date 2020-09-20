// package imports
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import BoxPlot from "../../components/charts/box-plot";

// data
const csvStaticFilePath = "/data/diamonds.csv";

// component
const BoxPlotPage = () => {
  // data
  const [data, setData] = useState([]);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const csvFile = await fetch(csvStaticFilePath); // csv with 2 columns
      const csvText = await csvFile.text(); // csv as string
      const csvData = d3.csvParse(
        csvText, // csv string to parse
        ({ carat, price }) => ({ x: +carat, y: +price }) // callback
      );
      setData(csvData);
    };
    getData();
  }, []);
  // jsx
  return (
    <div>
      <BoxPlot data={data} />
    </div>
  );
};

export default BoxPlotPage;
