import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// example
// http://recharts.org/en-US/examples/SimpleLineChart

const App = () => {
  // data
  const [data, setData] = useState({
    setA: [
      { x: 100, y: 200, z: 200 },
      { x: 120, y: 100, z: 260 },
      { x: 170, y: 300, z: 400 },
      { x: 140, y: 250, z: 280 },
      { x: 150, y: 400, z: 500 },
      { x: 110, y: 280, z: 200 },
    ],
    setB: [
      { x: 200, y: 260, z: 240 },
      { x: 240, y: 290, z: 220 },
      { x: 190, y: 290, z: 250 },
      { x: 198, y: 250, z: 210 },
      { x: 180, y: 280, z: 260 },
      { x: 210, y: 220, z: 230 },
    ],
  });

  // jsx
  return (
    <div>
      <ScatterChart
        width={400}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          name="stature"
          unit="cm"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="weight"
          unit="kg"
          tick={{ fontSize: 12 }}
        />
        <ZAxis
          type="number"
          dataKey="z"
          range={[60, 400]}
          name="score"
          unit="km"
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          labelStyle={{ fontSize: 14 }}
          itemStyle={{ fontSize: 12 }}
        />
        <Legend />
        <Scatter name="A" data={data.setA} fill="#8884d8" shape="circle" />
        <Scatter name="B" data={data.setB} fill="#82ca9d" shape="circle" />
      </ScatterChart>
    </div>
  );
};

export default App;
