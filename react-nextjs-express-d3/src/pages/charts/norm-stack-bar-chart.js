// package imports
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import NormStackBarChart from "../../components/charts/norm-stack-bar-chart";

// data
const csvStaticFilePath = "/data/us-population-state-age.csv";

// component
const NormStackBarChartPage = () => {
  // data
  const [data, setData] = useState([]);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const csvFile = await fetch(csvStaticFilePath); // csv with 2 columns
      const csvText = await csvFile.text(); // csv as string
      const csvData = d3.csvParse(
        csvText, // csv string to parse
        (d, i, columns) => (
          d3.autoType(d), (d.total = d3.sum(columns, (c) => d[c])), d
        )
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
      <NormStackBarChart data={data} />
    </div>
  );
};

export default NormStackBarChartPage;
