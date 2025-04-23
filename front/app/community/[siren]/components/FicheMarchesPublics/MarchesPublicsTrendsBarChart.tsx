import { formatCompactPrice, formatNumber } from '@/utils/utils';
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { CHART_HEIGHT } from '../constants';

const LEGEND_LABELS: Record<string, string> = {
  nombre: 'Nombre de marchés publics publiées',
  montant: 'Montant des marchés publics publiées (€)',
};

function getLegendFormatter(value: string): string {
  const label = LEGEND_LABELS[value];
  if (!label) {
    throw new Error(`Clé de légende inconnue : "${value}".`);
  }
  return label;
}

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
      {formatCompactPrice(value)}
    </text>
  );
};

const renderNumberLabel = (props: any) => {
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
      {formatNumber(value)}
    </text>
  );
};

type ChartData = {
  annee: number;
  montant: number;
  nombre: number;
};

export default function MarchesPublicsTrendsBarChart({
  data,
  datakey,
}: {
  data: ChartData[];
  datakey: string;
}) {
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
          <YAxis
            tickFormatter={(value) => (datakey === 'montant' ? formatCompactPrice(value) : value)}
          />
          <Legend formatter={getLegendFormatter} />
          <Bar dataKey={datakey} stackId='a' fill='#525252' barSize={120} radius={[10, 10, 0, 0]}>
            <LabelList
              position='top'
              content={(value) =>
                datakey === 'montant' ? renderLabel(value) : renderNumberLabel(value)
              }
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
