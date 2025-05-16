import { formatCompactPrice, formatCompact } from '@/utils/utils';
import { Bar, BarChart, LabelList, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { CHART_HEIGHT } from '../constants';

const LEGEND_LABELS: Record<string, string> = {
  nombre: 'Nombre de marchés publics publiées',
  montant: 'Montant des marchés publics publiées (€)',
};

function getLegendFormatter(isContractDisplayed: boolean): string {
  const label = isContractDisplayed ? LEGEND_LABELS.nombre : LEGEND_LABELS.montant;
  if (!label) {
    throw new Error(`Clé de légende inconnue.`);
  }
  return label;
}

function renderLabel(props: any, isContractDisplayed: boolean) {
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
      {isContractDisplayed ? formatCompact(value) : formatCompactPrice(value)}
    </text>
  );
}

function renderYaxisLabel(value: number, isContractDisplayed: boolean): string {
  return isContractDisplayed ? String(value) : formatCompactPrice(value);
}

type ChartData = {
  annee: number;
  yValue: number;
};

type MarchesPublicsTrendsBarChartProps = {
  data: ChartData[];
  isContractDisplayed: boolean;
};

export default function MarchesPublicsTrendsBarChart({
  data,
  isContractDisplayed,
}: MarchesPublicsTrendsBarChartProps) {
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
          <YAxis tickFormatter={(value) => renderYaxisLabel(value, isContractDisplayed)} />
          <Legend formatter={() => getLegendFormatter(isContractDisplayed)} />
          <Bar dataKey={'yValue'} stackId='a' fill='#525252' barSize={120} radius={[10, 10, 0, 0]}>
            <LabelList
              position='top'
              content={(props) => renderLabel(props, isContractDisplayed)}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
