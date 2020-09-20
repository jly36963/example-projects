// package imports
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import GroupedBarChart from "../../components/charts/grouped-bar-chart";

// data fp
const csvStaticFilePath = "/data/grouped-bar-chart-data.csv";

// component
const GroupedBarChartPage = () => {
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
      const sortedCsvData = csvData.sort(
        (a, b) => b["<10"] / b.total - a["<10"] / a.total
      );
      setData(sortedCsvData);
    };
    getData();
  }, []);
  // jsx
  return (
    <div>
      <GroupedBarChart data={data} />
    </div>
  );
};

export default GroupedBarChartPage;
