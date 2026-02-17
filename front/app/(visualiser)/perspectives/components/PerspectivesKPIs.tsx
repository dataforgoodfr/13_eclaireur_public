'use client';

import type { PerspectivesKPIs } from '#utils/fetchers/perspectives/fetchPerspectivesData';
import { formatNumberInteger } from '#utils/utils';
import { Award, Building2, FileText, HandCoins, Scale, TrendingUp, Users } from 'lucide-react';

type KPICardProps = {
  value: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  color: string;
};

function KPICard({ value, label, sublabel, icon, color }: KPICardProps) {
  return (
    <div className='rounded-xl border bg-card p-5 shadow-sm'>
      <div className='flex items-start gap-3'>
        <div className={`rounded-lg p-2 ${color}`}>{icon}</div>
        <div className='min-w-0 flex-1'>
          <p className='text-2xl font-bold md:text-3xl'>{value}</p>
          <p className='text-sm font-medium text-muted-foreground'>{label}</p>
          {sublabel && <p className='mt-1 text-xs text-muted-foreground'>{sublabel}</p>}
        </div>
      </div>
    </div>
  );
}

function formatAmount(n: number): string {
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(1)} T€`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)} Md€`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} M€`;
  return `${formatNumberInteger(n)} €`;
}

export default function PerspectivesKPICards({ kpis }: { kpis: PerspectivesKPIs }) {
  const pctMpCoverage =
    kpis.collectivitesSoumises > 0
      ? ((kpis.mpCoverage / kpis.collectivitesSoumises) * 100).toFixed(1)
      : '0';
  const pctSubCoverage =
    kpis.collectivitesSoumises > 0
      ? ((kpis.subCoverage / kpis.collectivitesSoumises) * 100).toFixed(1)
      : '0';

  return (
    <div className='space-y-4'>
      {/* Ligne 1 : Périmètre */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <KPICard
          value={formatNumberInteger(kpis.totalCollectivites)}
          label='Collectivités en France'
          sublabel={`${formatNumberInteger(kpis.totalCommunes)} communes, ${kpis.totalDepartements} départements, ${kpis.totalRegions} régions, ${formatNumberInteger(kpis.totalIntercommunalites)} intercommunalités`}
          icon={<Building2 className='h-5 w-5 text-blue-600' />}
          color='bg-blue-50'
        />
        <KPICard
          value={formatNumberInteger(kpis.collectivitesSoumises)}
          label='Soumises à la loi'
          sublabel={`Communes de plus de 3 500 habitants (${formatNumberInteger(kpis.communesSoumises)}) + départements, régions, intercommunalités`}
          icon={<Scale className='h-5 w-5 text-indigo-600' />}
          color='bg-indigo-50'
        />
      </div>

      {/* Ligne 2 : MP vs Subventions face à face avec score A/B intégré */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='rounded-xl border bg-card p-5 shadow-sm'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='rounded-lg bg-blue-50 p-2'>
              <FileText className='h-5 w-5 text-blue-600' />
            </div>
            <h3 className='font-semibold'>Marchés publics</h3>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-2xl font-bold'>{formatNumberInteger(kpis.totalMarchesPublics)}</p>
              <p className='text-xs text-muted-foreground'>marchés déclarés</p>
            </div>
            <div>
              <p className='text-2xl font-bold'>{formatAmount(Number(kpis.mpMontantTotal))}</p>
              <p className='text-xs text-muted-foreground'>montant total déclaré</p>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  <span className='font-semibold'>{formatNumberInteger(kpis.mpCoverage)}</span>{' '}
                  collectivités soumises publient ({pctMpCoverage} %)
                </span>
              </div>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <Award className='h-4 w-4 text-emerald-600' />
                <span className='text-sm'>
                  <span className='text-2xl font-bold text-emerald-600'>{kpis.pctScoreABMp} %</span>{' '}
                  score A ou B
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='rounded-xl border bg-card p-5 shadow-sm'>
          <div className='mb-3 flex items-center gap-2'>
            <div className='rounded-lg bg-amber-50 p-2'>
              <HandCoins className='h-5 w-5 text-amber-600' />
            </div>
            <h3 className='font-semibold'>Subventions</h3>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-2xl font-bold'>{formatNumberInteger(kpis.totalSubventions)}</p>
              <p className='text-xs text-muted-foreground'>subventions déclarées</p>
            </div>
            <div>
              <p className='text-2xl font-bold'>{formatAmount(Number(kpis.subMontantTotal))}</p>
              <p className='text-xs text-muted-foreground'>montant total déclaré</p>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>
                  <span className='font-semibold'>{formatNumberInteger(kpis.subCoverage)}</span>{' '}
                  collectivités soumises publient ({pctSubCoverage} %)
                </span>
              </div>
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <Award className='h-4 w-4 text-red-500' />
                <span className='text-sm'>
                  <span className='text-2xl font-bold text-red-500'>{kpis.pctScoreABSub} %</span>{' '}
                  score A ou B
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insight mis en avant */}
      <div className='flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4'>
        <TrendingUp className='mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600' />
        <p className='text-sm text-amber-900'>
          <span className='font-semibold'>Le contraste est frappant :</span> {pctMpCoverage} % des
          collectivités soumises à la loi publient leurs marchés publics, mais seulement{' '}
          {pctSubCoverage} % publient leurs subventions.
        </p>
      </div>
    </div>
  );
}
