// package imports
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import PieChart from '../../components/charts/pie-chart';

// data fp
const csvStaticFilePath = '/data/population-by-age.csv';

// component
const PieChartPage = () => {
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
      <PieChart data={data} />
    </div>
  );
};

export default PieChartPage;
