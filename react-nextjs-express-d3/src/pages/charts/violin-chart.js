// package imports
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import ViolinChart from "../../components/charts/violin-chart";

// data
const csvStaticFilePath = "/data/iris-data.csv";

// main component
const ViolinChartPage = () => {
  // data
  const [data, setData] = useState([]);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const csvFile = await fetch(csvStaticFilePath); // csv with 2 columns
      const csvText = await csvFile.text(); // csv as string
      const csvData = d3.csvParse(
        csvText, // csv string to parse
        d3.autoType
      );
      setData(csvData);
    };
    getData();
  }, []);
  // jsx
  return (
    <div>
      <ViolinChart data={data} />
    </div>
  );
};

export default ViolinChartPage;
