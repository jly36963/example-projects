// package imports
import React, { useState, useRef, useEffect } from 'react';
import HistKDEChart from '../../components/charts/hist-kde-chart';

// data
const jsonStaticFilePath = '/data/old-faithful.json';

// main component
const HistKDEChartPage = () => {
  // data
  const [data, setData] = useState([]);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const jsonFile = await fetch(jsonStaticFilePath);
      const jsonData = await jsonFile.json();
      setData(jsonData);
    };
    getData();
  }, []);
  // jsx
  return (
    <div>
      <HistKDEChart data={data} />
    </div>
  );
};

export default HistKDEChartPage;
