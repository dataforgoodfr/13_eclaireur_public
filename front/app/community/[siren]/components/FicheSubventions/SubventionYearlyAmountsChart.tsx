'use client';

import Loading from '@/components/ui/Loading';
import { useSubventionYearlyAmounts } from '@/utils/hooks/useSubventionYearlyAmounts';
import { formatCompact } from '@/utils/utils';
import {
  Bar,
  LabelList,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { CHART_HEIGHT } from '../constants';

type SubventionYearlyAmountsChartProps = {
  siren: string;
};

export function SubventionYearlyAmountsChart({ siren }: SubventionYearlyAmountsChartProps) {
  const { data, isPending, isError } = useSubventionYearlyAmounts(siren);

  if (isPending || isError) {
    return <Loading style={{ height: CHART_HEIGHT }} />;
  }

  return <BarChart data={data} />;
}

const LEGEND_LABELS: Record<Exclude<keyof BarChartData[number], 'year'>, string> = {
  amount: 'Nombre de subventions publiées',
};

function getLegendFormatter(value: Exclude<keyof BarChartData[number], 'year'>): string {
  const label = LEGEND_LABELS[value];
  if (!label) {
    throw new Error(`Clé de légende inconnue : "${value}".`);
  }
  return label;
}

type BarChartData = {
  year: number;
  amount: number;
}[];

type BarChartProps = {
  data: BarChartData;
};

function BarChart({ data }: BarChartProps) {
  return (
    <ResponsiveContainer width='100%' height={CHART_HEIGHT}>
      <RechartsBarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 30,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey='year' axisLine={true} tickLine={true} />
        <YAxis tickFormatter={(value) => formatCompact(value)} />
        <Legend formatter={getLegendFormatter} />
        <Bar dataKey='amount' stackId='a' fill='#525252' barSize={120} radius={[10, 10, 0, 0]}>
          <LabelList position='top' formatter={formatCompact} />
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
