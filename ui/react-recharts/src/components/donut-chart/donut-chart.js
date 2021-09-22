import React, { useState } from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

// example
// http://recharts.org/en-US/examples/SimpleLineChart

const App = () => {
  // data
  const [data, setData] = useState([
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ]);

  // colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // jsx
  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          innerRadius={50}
          outerRadius={80}
          labelLine={false}
          label
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
          style={{ fontSize: 14 }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip labelStyle={{ fontSize: 14 }} itemStyle={{ fontSize: 12 }} />
      </PieChart>
    </div>
  );
};

export default App;
