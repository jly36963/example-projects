import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';

// example
// http://recharts.org/en-US/examples/SimpleLineChart

const App = () => {
  // data
  const [data, setData] = useState([
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ]);

  // jsx
  return (
    <div>
      <ScatterChart
        width={400}
        height={400}
        margin={{
          top: 20, right: 20, bottom: 20, left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="stature" unit="cm" tick={{ fontSize: 12 }}/>
        <YAxis type="number" dataKey="y" name="weight" unit="kg" tick={{ fontSize: 12 }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} labelStyle={{ fontSize: 14 }} itemStyle={{ fontSize: 12 }} />
        <Scatter name="A school" data={data} fill="#8884d8" />
      </ScatterChart>
    </div>
  )
}

export default App;