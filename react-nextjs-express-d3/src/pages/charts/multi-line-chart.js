// package imports
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import MultiLineChart from '../../components/charts/multi-line-chart';

// data fp
const tsvStaticFilePath = '/data/unemployment.tsv';

// component
const MultiLineChartPage = () => {
  // data
  const [data, setData] = useState(null);
  // fetch data
  useEffect(() => {
    const getData = async () => {
      const tsvFile = await fetch(tsvStaticFilePath); // tsv file
      const tsvText = await tsvFile.text(); // tsv as string
      const tsvData = d3.tsvParse(tsvText);
      const columns = tsvData.columns.slice(1);
      const formattedTsvData = {
        y: '% Unemployment',
        series: tsvData.map((d) => ({
          name: d.name.replace(/, ([\w-]+).*/, ' $1'),
          values: columns.map((k) => +d[k]),
        })),
        dates: columns.map(d3.utcParse('%Y-%m')),
      };
      setData(formattedTsvData);
    };
    getData();
  }, []);
  // jsx
  return (
    <div>
      <MultiLineChart data={data} />
    </div>
  );
};

export default MultiLineChartPage;
