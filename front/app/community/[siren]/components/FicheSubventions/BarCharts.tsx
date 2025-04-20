import { formatNumber } from '@/utils/utils';
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type ChartData = {
  annee: number;
  montant: number;
  nombre: number;
};

export default function BarCharts({ data }: { data: ChartData[] }) {
  return (
    <div className='p-4'>
      <ResponsiveContainer width='100%' height={600}>
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
          <Legend
            formatter={(value) => {
              const legendLabels: Record<string, string> = {
                nombre: 'Nombre de subventions',
              };
              return legendLabels[value] || value;
            }}
          />
          <Bar dataKey='nombre' stackId='a' fill='#525252' barSize={120} radius={[10, 10, 0, 0]}>
            <LabelList position='top' formatter={(value: number) => formatNumber(value)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
