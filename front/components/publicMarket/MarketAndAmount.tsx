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
      "Année": "2018",
      "Montant": 56702809,
      "Nombre": 153
  },
  {
      "Année": "2019",
      "Montant": 239899229,
      "Nombre": 447
  },
  {
      "Année": "2020",
      "Montant": 290872324,
      "Nombre": 508
  },
  {
      "Année": "2021",
      "Montant": 507880077,
      "Nombre": 744
  },
  {
      "Année": "2022",
      "Montant": 405725497,
      "Nombre": 703
  },
  {
      "Année": "2023",
      "Montant": 499410387,
      "Nombre": 658
  }
]


export default function MarketAndAmount({data}:{data: any[]}) {
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
          <XAxis dataKey="Année"/>
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Montant" yAxisId="left" barSize={20} fill="#413ea0" />
          <Line type="monotone"  yAxisId="right" dataKey="Nombre" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
