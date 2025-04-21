import { formatCompactPrice } from '@/utils/utils';
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const montantEntry = payload.find((entry: any) => entry.name === 'montant');
    const budgetEntry = payload.find((entry: any) => entry.name === 'stackedBudget');
    const budget = montantEntry.value + budgetEntry.value;
    const tauxPublication =
      montantEntry && budgetEntry
        ? ((montantEntry.value / (montantEntry.value + budgetEntry.value)) * 100).toFixed(1)
        : '0';

    return (
      <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-lg'>
        <p className='font-semibold text-gray-900'>{label}</p>
        <div className='mt-2 space-y-1'>
          {!isNaN(Number(tauxPublication)) && (
            <div className='flex items-center gap-2 pt-1'>
              <span className='text-sm text-gray-600'>Taux de publication</span>
              <span className='text-sm font-medium text-gray-900'>{tauxPublication}%</span>
            </div>
          )}
          {payload.map((entry: any, index: number) => (
            <div key={index} className='flex items-center gap-2'>
              <div className='h-3 w-3 rounded-full' style={{ backgroundColor: entry.color }} />
              <span className='text-sm text-gray-600'>
                {entry.name === 'montant' && 'Subventions publiées'}
                {entry.name === 'stackedBudget' && 'Budget des subventions'}
              </span>
              <span className='text-sm font-medium text-gray-900'>
                {entry.name === 'montant' && formatCompactPrice(entry.value)}
                {entry.name === 'stackedBudget' && formatCompactPrice(budget)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const renderLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 10}
      fill='#4e4e4e'
      textAnchor='middle'
      dominantBaseline='middle'
      fontSize='16'
    >
      {value ? formatCompactPrice(value) : ''}
    </text>
  );
};

const LEGEND_LABELS: Record<string, string> = {
  montant: 'Subventions publiées (€)',
  stackedBudget: 'Budget des subventions (€)',
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
  budget?: number;
  stackedBudget?: number;
  tauxPublication?: number;
};

export default function SubventionTrendsStackedBarCharts({ data }: { data: ChartData[] }) {
  return (
    <div>
      <ResponsiveContainer width='100%' height={600} className='p-4'>
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
          <YAxis tickFormatter={(value) => formatCompactPrice(value)} />
          <Tooltip
            content={<CustomTooltip />}
            animationDuration={300}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend verticalAlign='bottom' align='center' formatter={getLegendFormatter} />
          <Bar dataKey='montant' stackId='a' fill='#525252' barSize={120}></Bar>
          <Bar dataKey='stackedBudget' stackId='a' fill='#a3a3a3' radius={[10, 10, 0, 0]}>
            <LabelList content={renderLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
