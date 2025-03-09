import React, { PureComponent } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 590,
    pv: 800,
  },
  {
    name: 'Page B',
    uv: 868,
    pv: 967,
  },
  {
    name: 'Page C',
    uv: 1397,
    pv: 1098,
  },
  {
    name: 'Page D',
    uv: 1480,
    pv: 1200,
  },
  {
    name: 'Page E',
    uv: 1520,
    pv: 1108,
  },
  {
    name: 'Page F',
    uv: 1400,
    pv: 680,
  },
];

export default function MarketAndAmount() {
  return (
    <div className='max-w-screen-lg mx-auto p-4 border rounded-lg shadow my-6'>
      <h2 className='text-lg font-medium text-neutral-600 pb-3'>Évolution des marchés publics au cours du temps</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="uv" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
