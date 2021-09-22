// package imports
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import BarChartH from '../../components/charts/bar-chart-h';

// data
const csvStaticFilePath = '/data/alphabet.csv';

// main component
const BarChartHPage = () => {
  // data
  const [data, setData] = useState([]);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const csvFile = await fetch(csvStaticFilePath); // csv with 2 columns
      const csvText = await csvFile.text(); // csv as string
      const csvData = d3.csvParse(
        csvText, // csv string to parse
        ({ letter, frequency }) => ({ name: letter, value: +frequency }),
      );
      const sortedCsvData = csvData.sort((a, b) => d3.descending(a.value, b.value));
      setData(sortedCsvData);
    };
    getData();
  }, []);
  // jsx
  return (
    <div>
      <BarChartH data={data} />
    </div>
  );
};

export default BarChartHPage;
