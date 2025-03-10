import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';


const COLORS = ['#ed7d1f', '#e41b23', '#592d8c', '#0163ae',"#00a15d","#ccb406"];



export default function MarketProcess({data} : {data: any[]}) {

  return (
    <div className='border rounded-lg shadow p-4'>
      <h2 className='text-lg font-medium text-neutral-600 pb-3'>Répartition par procédure (en quantité)</h2> 
      {data.length === 0 ? (
        <div className='flex justify-center items-center w-full h-[400px] space-x-2'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-600'></div>
          <span>Chargement...</span>
        </div>
      ) : (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart width={800} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend  align='left'/>
        </PieChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
