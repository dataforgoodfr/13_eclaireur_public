"use client"
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

type formattedDataTrends = {
  Année: number;
  Montant: number;
  Nombre: number;
};

export default function Trends({data}:{data: any[]}) {

  const trends: formattedDataTrends[] = Object.values(
    data.reduce<Record<string, formattedDataTrends>>((acc, item) => {
      const year = item.datenotification_annee;

      if (!acc[year]) {
        acc[year] = { Année: year, Montant: 0, Nombre: 0 };
      }
      acc[year].Montant += parseFloat(item.montant) || 0;
      acc[year].Nombre += 1;

      return acc;
    }, {}),
  );

  return (
    <div className='p-4 border'>
      <ResponsiveContainer width="100%" height={600}>
        <ComposedChart
          width={500}
          height={400}
          data={trends}
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
          <YAxis yAxisId="right" orientation="right" stroke="#ff7300" />
          <Tooltip 
            formatter={(value, name) => {
              const tooltipLabels: Record<string, string> = {
                Nombre: "Nombre de marchés",
              };
              return [value, tooltipLabels[name] || name]; // Retourne la valeur et le nom modifié
            }}
          />    
          <Legend 
            formatter={(value) => {
              const legendLabels: Record<string, string> = {
                Montant: "Montant total annuel (€)",
                Nombre: "Nombre de marchés",
              };
              return legendLabels[value] || value;
            }}
          />
          <Bar dataKey="Montant" yAxisId="left" barSize={20} fill="#413ea0" />
          <Line type="monotone"  yAxisId="right" dataKey="Nombre" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
