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

  // // custom label
  // const RADIAN = Math.PI / 180;
  // const renderCustomizedLabel = ({
  //   cx, cy, midAngle, innerRadius, outerRadius, percent, index,
  // }) => {
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);
  //   return (
  //     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
  //       {`${(percent * 100).toFixed(0)}%`}
  //     </text>
  //   );
  // };

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
          labelLine
          label
          // label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={1}
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
