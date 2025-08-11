'use client';

import ChartSkeleton from './ChartSkeleton';
import { ActionButton } from '#components/ui/action-button';
import { formatCompact } from '#utils/utils';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import {
  Bar,
  LabelList,
  Legend,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

import { ErrorFetching } from '../../../../components/ui/ErrorFetching';
import { CHART_HEIGHT } from './constants';

export type ChartDataType = 'marches-publics' | 'subventions';
export type DisplayMode = 'amounts' | 'counts';

type EvolutionChartProps = {
  siren: string;
  displayMode: DisplayMode;
  chartType: ChartDataType;
  data: any;
  isPending: boolean;
  isError: boolean;
};

const CHART_CONFIG = {
  'marches-publics': {
    barColor: '#CAD2FC', // score-transparence mp (brand-2)
    borderColor: '#303F8D',
    legendLabels: {
      amounts: 'Montant des marchés publics publiées (€)',
      counts: 'Nombre de marchés publics publiées',
    },
  },
  'subventions': {
    barColor: '#FAF79E', // score-transparence subvention (brand-1)
    borderColor: '#303F8D',
    legendLabels: {
      amounts: 'Montant des subventions publiées (€)',
      counts: 'Nombre de subventions publiées',
    },
  },
};

export function EvolutionChart({
  siren,
  displayMode,
  chartType,
  data,
  isPending,
  isError
}: EvolutionChartProps) {
  const config = CHART_CONFIG[chartType];
  const isAmountsMode = displayMode === 'amounts';

  // Memoize chart data to avoid recalculations and flashing
  const chartData = useMemo(() => {
    const initialList: BarChartData = [];
    for (let i = 0; i <= 7; i++) {
      initialList.push({
        year: new Date(Date.now()).getFullYear() - 7 + i,
        value: 0,
      });
    }

    return initialList.map((el) => {
      const found = data?.find((item: any) => item.year === el.year);
      const value = isAmountsMode
        ? found?.amount ?? el.value
        : found?.count ?? el.value;
      return { ...el, value };
    });
  }, [data, isAmountsMode]);

  // Check if all data is zero (no data state)
  const hasNoData = useMemo(() => 
    !data || data.length === 0 || chartData.every(item => item.value === 0),
    [data, chartData]
  );

  if (isPending) return <ChartSkeleton />;
  if (isError) return <ErrorFetching style={{ height: CHART_HEIGHT }} />;

  return <BarChart
    data={chartData}
    displayMode={displayMode}
    chartType={chartType}
    barColor={config.barColor}
    borderColor={config.borderColor}
    hasNoData={hasNoData}
    siren={siren}
    legendLabel={config.legendLabels[displayMode]}
  />;
}

function formatLabel(value: number): string {
  if (value === 0) return 'Aucunes données publiées';
  return formatCompact(value);
}

type BarChartData = {
  year: number;
  value: number;
}[];

type BarChartProps = {
  data: BarChartData;
  displayMode: DisplayMode;
  chartType: ChartDataType;
  barColor: string;
  borderColor: string;
  hasNoData: boolean;
  siren?: string;
  legendLabel: string;
};

function BarChart({
  data,
  displayMode,
  chartType,
  barColor,
  borderColor,
  hasNoData,
  siren,
  legendLabel
}: BarChartProps) {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInterpellerClick = () => {
    if (siren) {
      router.push(`/interpeller/${siren}/step1`);
    }
  };

  // Pour mobile : graphique horizontal
  if (isMobile) {
    // Inverser l'ordre des données pour avoir les années récentes en haut
    const reversedData = [...data].reverse();

    return (
      <ResponsiveContainer width='100%' height={Math.max(CHART_HEIGHT, data.length * 60)}>
        <RechartsBarChart
          layout="horizontal"
          width={500}
          height={300}
          data={reversedData}
          margin={{
            top: 20,
            right: 80,
            left: 10,
            bottom: 40,
          }}
        >
          <XAxis type="number" tickFormatter={(value) => formatCompact(value)} />
          <YAxis dataKey='year' type="category" axisLine={true} tickLine={true} width={50} />
          <Legend
            formatter={() => legendLabel}
            wrapperStyle={{
              color: '#000000 !important',
              fontWeight: 600,
              paddingTop: '10px'
            }}
            iconType="rect"
          />
          <Bar dataKey='value' fill={barColor} stroke={borderColor} strokeWidth={1} radius={[16, 0, 0, 0]}>
            <LabelList position='right' formatter={formatLabel} fill='#303F8D' fontSize={14} fontWeight={700} />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  // Pour desktop : graphique vertical
  // Si pas de données, afficher l'image no-data-bar avec le bouton
  if (hasNoData && !isMobile) {
    return (
      <div className='flex flex-col items-center justify-center' style={{ height: CHART_HEIGHT }}>
        <div className='relative flex flex-col items-center gap-6'>
          {/* Bouton Interpeller au-dessus de l'image */}
          <ActionButton
            onClick={handleInterpellerClick}
            icon={<MessageSquare size={20} />}
            variant='primary'
          />

          {/* Image no-data-bar */}
          <div className='relative'>
            <Image
              src='/no-data-bar.png'
              alt='Aucunes données publiées'
              width={150}
              height={200}
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  // Graphique normal avec données
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
        <Legend
          formatter={() => legendLabel}
          wrapperStyle={{
            color: '#000000 !important',
            fontWeight: 600
          }}
          iconType="rect"
          contentStyle={{
            color: '#000000 !important'
          }}
        />
        <Bar dataKey='value' stackId='a' fill={barColor} stroke={borderColor} strokeWidth={1} radius={[16, 0, 0, 0]}>
          <LabelList position='top' formatter={formatLabel} fill='#303F8D' fontSize={18} fontWeight={700} />
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}