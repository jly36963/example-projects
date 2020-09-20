// package imports
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import AreaChart from "../../components/charts/area-chart";

// data
const csvStaticFilePath = "/data/aapl.csv";

// main component
const AreaChartPage = () => {
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
      const mappedCsvData = csvData.map(({ date, close }) => ({
        date,
        value: close,
      }));
      setData(mappedCsvData);
    };
    getData();
  }, []);
  // jsx
  return (
    <div>
      <AreaChart data={data} />
    </div>
  );
};

export default AreaChartPage;
