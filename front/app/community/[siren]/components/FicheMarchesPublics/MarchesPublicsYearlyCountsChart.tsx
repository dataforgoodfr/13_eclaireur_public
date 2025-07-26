'use client';

import Loading from '#components/ui/Loading';
import { useMarchesPublicsYearlyCounts } from '#utils/hooks/useMarchesPublicsYearlyCounts';
import { formatCompact } from '#utils/utils';
import {
  Bar,
  LabelList,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { ErrorFetching } from '../../../../../components/ui/ErrorFetching';
import { CHART_HEIGHT } from '../constants';

type MarchesPublicsYearlyCountsChartProps = {
  siren: string;
};

export function MarchesPublicsYearlyCountsChart({ siren }: MarchesPublicsYearlyCountsChartProps) {
  const { data, isPending, isError } = useMarchesPublicsYearlyCounts(siren);

  if (isPending) return <Loading style={{ height: CHART_HEIGHT }} />;
  if (isError) return <ErrorFetching style={{ height: CHART_HEIGHT }} />;

  const initalList: BarChartData = [];
  for (let i = 0; i <= 7; i++) {
    initalList.push({
      year: new Date(Date.now()).getFullYear() - 7 + i,
      count: 0,
    });
  }

  const chartData: BarChartData = initalList.map((el) => {
    const found = data.find((item) => item.year === el.year);
    return { ...el, count: found?.count ?? el.count };
  });

  return <BarChart data={chartData} />;
}

const LEGEND_LABELS: Record<Exclude<keyof BarChartData[number], 'year'>, string> = {
  count: 'Nombre de marchés publics publiées',
};

function getLegendFormatter(value: Exclude<keyof BarChartData[number], 'year'>): string {
  const label = LEGEND_LABELS[value];
  if (!label) {
    throw new Error(`Clé de légende inconnue : "${value}".`);
  }
  return label;
}

function formatLabel(value: number): string {
  if (value === 0) return 'Aucunes données publiées';
  return formatCompact(value);
}

type BarChartData = {
  year: number;
  count: number;
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
        <Bar dataKey='count' stackId='a' fill='#525252' radius={[10, 10, 0, 0]}>
          <LabelList position='top' formatter={formatLabel} />
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
