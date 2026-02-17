'use client';

import type { ScoreDistribution } from '#utils/fetchers/perspectives/fetchPerspectivesData';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { SCORE_COLORS, SCORE_ORDER, TYPE_LABELS, TYPE_ORDER } from '../constants';

type Props = {
  mpDistribution: ScoreDistribution[];
  subDistribution: ScoreDistribution[];
  year: number;
};

function buildByTypeData(distribution: ScoreDistribution[], year: number) {
  const typeMap = new Map<string, Record<string, number>>();

  for (const row of distribution) {
    if (Number(row.annee) !== year) continue;
    const existing = typeMap.get(row.type) || { A: 0, B: 0, C: 0, D: 0, E: 0 };
    existing[row.score] = (existing[row.score] || 0) + row.count;
    typeMap.set(row.type, existing);
  }

  return TYPE_ORDER.filter((t) => typeMap.has(t)).map((type) => {
    const scores = typeMap.get(type)!;
    const total = Object.values(scores).reduce((sum, v) => sum + v, 0);
    return {
      type: TYPE_LABELS[type] || type,
      A: total > 0 ? Number(((scores.A / total) * 100).toFixed(1)) : 0,
      B: total > 0 ? Number(((scores.B / total) * 100).toFixed(1)) : 0,
      C: total > 0 ? Number(((scores.C / total) * 100).toFixed(1)) : 0,
      D: total > 0 ? Number(((scores.D / total) * 100).toFixed(1)) : 0,
      E: total > 0 ? Number(((scores.E / total) * 100).toFixed(1)) : 0,
    };
  });
}

function TypeChart({ data, title }: { data: ReturnType<typeof buildByTypeData>; title: string }) {
  return (
    <div className='rounded-xl border bg-card p-4 shadow-sm'>
      <h4 className='mb-4 text-sm font-semibold text-muted-foreground'>{title}</h4>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='type' tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
          <Tooltip
            formatter={(value: number, name: string) => [`${value} %`, `Score ${name}`]}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Legend />
          {SCORE_ORDER.map((score) => (
            <Bar
              key={score}
              dataKey={score}
              stackId='scores'
              fill={SCORE_COLORS[score]}
              name={score}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ScoreByTypeChart({ mpDistribution, subDistribution, year }: Props) {
  const mpData = buildByTypeData(mpDistribution, year);
  const subData = buildByTypeData(subDistribution, year);

  return (
    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
      <TypeChart data={mpData} title={`Marchés publics — ${year}`} />
      <TypeChart data={subData} title={`Subventions — ${year}`} />
    </div>
  );
}
