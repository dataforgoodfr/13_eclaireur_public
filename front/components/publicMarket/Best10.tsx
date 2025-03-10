import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Entreprise A',
    montant: 40000,
  },
  {
    name: 'Entreprise B',
    montant: 35000,
  },
  {
    name: 'Entreprise C',
    montant: 28000,
  },
  {
    name: 'Entreprise D',
    montant: 27180,
  },
  {
    name: 'Entreprise E',
    montant: 21890,
  },
  {
    name: 'Entreprise F',
    montant: 16390,
  },
  {
    name: 'Entreprise G',
    montant: 13490,
  },
  {
    name: 'Entreprise H',
    montant: 8390,
  },
  {
    name: 'Entreprise I',
    montant: 9390,
  },
  {
    name: 'Entreprise J',
    montant: 2490,
  },
];



export default function Best10() {
  return (
    <div className='max-w-screen-lg mx-auto p-4 border rounded-lg shadow my-6'>
      <h2 className='text-lg font-medium text-neutral-600 pb-3'>Top 10 des titutaires ainsi que les montants alloués sur la période</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="montant" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
