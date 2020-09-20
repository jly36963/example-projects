import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';

// example
// http://recharts.org/en-US/examples/SimpleLineChart

const App = () => {
  // data
  const [data, setData] = useState([
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400, },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210, },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290, },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000, },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181, },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500, },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100, },
  ])

  // jsx
  return (
    <div>
      <LineChart
        width={800}
        height={500}
        data={data}
        margin={{
          top: 20, right: 20, left: 20, bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip labelStyle={{ fontSize: 14 }} itemStyle={{ fontSize: 12 }} />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </div>
  )
}

export default App;