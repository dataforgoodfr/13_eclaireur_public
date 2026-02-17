'use client';

import type { YearlyVolume } from '#utils/fetchers/perspectives/fetchPerspectivesData';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  volumes: YearlyVolume[];
};

function formatCompactAmount(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} Md`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} k`;
  return n.toString();
}

export default function VolumeChart({ volumes }: Props) {
  const mpCountData = volumes.map((v) => ({
    year: v.year.toString(),
    count: v.mp_count,
  }));

  const subCountData = volumes.map((v) => ({
    year: v.year.toString(),
    count: v.sub_count,
  }));

  const mpAmountData = volumes.map((v) => ({
    year: v.year.toString(),
    montant: Number(v.mp_total),
  }));

  const subAmountData = volumes.map((v) => ({
    year: v.year.toString(),
    montant: Number(v.sub_total),
  }));

  const mpBuyersData = volumes.map((v) => ({
    year: v.year.toString(),
    count: v.mp_buyers,
  }));

  const subGrantorsData = volumes.map((v) => ({
    year: v.year.toString(),
    count: v.sub_grantors,
  }));

  return (
    <div className='space-y-6'>
      {/* Marchés publics */}
      <div>
        <h3 className='mb-3 text-lg font-semibold'>Marchés publics</h3>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='rounded-xl border bg-card p-4 shadow-sm'>
            <h4 className='mb-4 text-sm font-semibold text-muted-foreground'>
              Nombre de marchés déclarés par an
            </h4>
            <ResponsiveContainer width='100%' height={280}>
              <AreaChart data={mpCountData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='year' tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCompactAmount(v)} />
                <Tooltip
                  formatter={(value: number) => [formatCompactAmount(value), 'Marchés']}
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                />
                <Area
                  type='monotone'
                  dataKey='count'
                  stroke='#2563eb'
                  fill='#2563eb20'
                  strokeWidth={2}
                  name='Marchés publics'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className='rounded-xl border bg-card p-4 shadow-sm'>
            <h4 className='mb-4 text-sm font-semibold text-muted-foreground'>
              Montants totaux déclarés par an
            </h4>
            <ResponsiveContainer width='100%' height={280}>
              <BarChart data={mpAmountData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='year' tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${formatCompactAmount(v)}\u20AC`}
                />
                <Tooltip
                  formatter={(value: number) => [`${formatCompactAmount(value)}\u20AC`, 'Montant']}
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                />
                <Bar dataKey='montant' fill='#2563eb' name='Marchés publics' />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className='rounded-xl border bg-card p-4 shadow-sm'>
            <h4 className='mb-4 text-sm font-semibold text-muted-foreground'>
              Collectivités qui publient par an
            </h4>
            <ResponsiveContainer width='100%' height={280}>
              <AreaChart data={mpBuyersData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='year' tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCompactAmount(v)} />
                <Tooltip
                  formatter={(value: number) => [formatCompactAmount(value), 'Acheteurs']}
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                />
                <Area
                  type='monotone'
                  dataKey='count'
                  stroke='#2563eb'
                  fill='#2563eb20'
                  strokeWidth={2}
                  name='Acheteurs'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subventions */}
      <div>
        <h3 className='mb-3 text-lg font-semibold'>Subventions</h3>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='rounded-xl border bg-card p-4 shadow-sm'>
            <h4 className='mb-4 text-sm font-semibold text-muted-foreground'>
              Nombre de subventions déclarées par an
            </h4>
            <ResponsiveContainer width='100%' height={280}>
              <AreaChart data={subCountData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='year' tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCompactAmount(v)} />
                <Tooltip
                  formatter={(value: number) => [formatCompactAmount(value), 'Subventions']}
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                />
                <Area
                  type='monotone'
                  dataKey='count'
                  stroke='#10b981'
                  fill='#10b98120'
                  strokeWidth={2}
                  name='Subventions'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className='rounded-xl border bg-card p-4 shadow-sm'>
            <h4 className='mb-4 text-sm font-semibold text-muted-foreground'>
              Montants totaux déclarés par an
            </h4>
            <ResponsiveContainer width='100%' height={280}>
              <BarChart data={subAmountData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='year' tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${formatCompactAmount(v)}\u20AC`}
                />
                <Tooltip
                  formatter={(value: number) => [`${formatCompactAmount(value)}\u20AC`, 'Montant']}
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                />
                <Bar dataKey='montant' fill='#10b981' name='Subventions' />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className='rounded-xl border bg-card p-4 shadow-sm'>
            <h4 className='mb-4 text-sm font-semibold text-muted-foreground'>
              Collectivités qui publient par an
            </h4>
            <ResponsiveContainer width='100%' height={280}>
              <AreaChart data={subGrantorsData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='year' tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCompactAmount(v)} />
                <Tooltip
                  formatter={(value: number) => [formatCompactAmount(value), 'Attribuants']}
                  contentStyle={{ borderRadius: 8, fontSize: 13 }}
                />
                <Area
                  type='monotone'
                  dataKey='count'
                  stroke='#10b981'
                  fill='#10b98120'
                  strokeWidth={2}
                  name='Attribuants'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
