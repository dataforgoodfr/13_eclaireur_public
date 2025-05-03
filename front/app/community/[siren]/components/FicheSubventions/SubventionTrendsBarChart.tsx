import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { CHART_HEIGHT } from '../constants';

const LEGEND_LABELS: Record<string, string> = {
  nombre: 'Nombre de subventions publiées (€)',
};

function getLegendFormatter(value: string): string {
  const label = LEGEND_LABELS[value];
  if (!label) {
    throw new Error(`Clé de légende inconnue : "${value}".`);
  }
  return label;
}

type ChartData = {
  annee: number;
  montant: number;
  nombre: number;
};

export default function SubventionTrendsBarChart({ data }: { data: ChartData[] }) {
  return (
    <div className='p-4'>
      <ResponsiveContainer width='100%' height={CHART_HEIGHT}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey='annee' axisLine={true} tickLine={true} />
          <YAxis />
          <Legend formatter={getLegendFormatter} />
          <Bar dataKey='nombre' stackId='a' fill='#525252' barSize={120} radius={[10, 10, 0, 0]}>
            <LabelList position='top' />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
