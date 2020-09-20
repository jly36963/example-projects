// package imports
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import BarChart from "../../components/charts/bar-chart";

// data
const csvStaticFilePath = "/data/alphabet.csv";

// main component
const BarChartPage = () => {
  // data
  const [data, setData] = useState([]);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const csvFile = await fetch(csvStaticFilePath); // csv with 2 columns
      const csvText = await csvFile.text(); // csv as string
      const csvData = d3.csvParse(
        csvText, // csv string to parse
        ({ letter, frequency }) => ({ name: letter, value: +frequency })
      );
      const sortedCsvData = csvData.sort((a, b) =>
        d3.descending(a.value, b.value)
      ); // , {format: "%", y: "↑ Frequency"})
      setData(sortedCsvData);
    };
    getData();
  }, []);
  // jsx
  return (
    <div>
      <BarChart data={data} />
    </div>
  );
};

export default BarChartPage;
