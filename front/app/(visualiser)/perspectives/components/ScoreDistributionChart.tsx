'use client';

import { useState } from 'react';

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

const SCORE_COLORS: Record<string, string> = {
  A: '#00C882',
  B: '#7FF083',
  C: '#F4D93E',
  D: '#FFB020',
  E: '#FB735F',
};

const TYPE_LABELS: Record<string, string> = {
  ALL: 'Toutes',
  COM: 'Communes',
  DEP: 'Départements',
  REG: 'Régions',
  GRP: 'Intercommunalités',
};

type Props = {
  mpDistribution: ScoreDistribution[];
  subDistribution: ScoreDistribution[];
};

function buildChartData(distribution: ScoreDistribution[], selectedType: string) {
  const yearMap = new Map<number, Record<string, number>>();

  for (const row of distribution) {
    if (selectedType !== 'ALL' && row.type !== selectedType) continue;

    const existing = yearMap.get(row.annee) || { A: 0, B: 0, C: 0, D: 0, E: 0 };
    existing[row.score] = (existing[row.score] || 0) + row.count;
    yearMap.set(row.annee, existing);
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, scores]) => {
      const total = Object.values(scores).reduce((sum, v) => sum + v, 0);
      return {
        year: year.toString(),
        A: total > 0 ? Number(((scores.A / total) * 100).toFixed(1)) : 0,
        B: total > 0 ? Number(((scores.B / total) * 100).toFixed(1)) : 0,
        C: total > 0 ? Number(((scores.C / total) * 100).toFixed(1)) : 0,
        D: total > 0 ? Number(((scores.D / total) * 100).toFixed(1)) : 0,
        E: total > 0 ? Number(((scores.E / total) * 100).toFixed(1)) : 0,
      };
    });
}

function ScoreChart({ data, title }: { data: ReturnType<typeof buildChartData>; title: string }) {
  return (
    <div className='rounded-xl border bg-card p-4 shadow-sm'>
      <h4 className='mb-4 text-sm font-semibold text-muted-foreground'>{title}</h4>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='year' tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
          <Tooltip
            formatter={(value: number, name: string) => [`${value}%`, `Score ${name}`]}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Legend />
          {(['A', 'B', 'C', 'D', 'E'] as const).map((score) => (
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

export default function ScoreDistributionChart({ mpDistribution, subDistribution }: Props) {
  const [selectedType, setSelectedType] = useState('ALL');

  const mpData = buildChartData(mpDistribution, selectedType);
  const subData = buildChartData(subDistribution, selectedType);

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-2'>
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              selectedType === type
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:bg-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <ScoreChart data={mpData} title='Marchés publics' />
        <ScoreChart data={subData} title='Subventions' />
      </div>
    </div>
  );
}
