'use client';

import { useEffect, useState } from 'react';
import Loading from '#components/ui/Loading';
import { useMarchesPublicsYearlyAmounts } from '#utils/hooks/useMarchesPublicsYearlyAmounts';
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
  Cell,
} from 'recharts';
import { ActionButton } from '#components/ui/action-button';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ErrorFetching } from '../../../../../components/ui/ErrorFetching';
import { CHART_HEIGHT } from '../constants';

type MarchesPublicsChartProps = {
  siren: string;
  displayMode: 'amounts' | 'counts';
  barColor?: string;
  borderColor?: string;
};

export function MarchesPublicsChart({ 
  siren, 
  displayMode,
  barColor = '#E8F787',
  borderColor = '#303F8D'
}: MarchesPublicsChartProps) {
  const { data: amountsData, isPending: amountsPending, isError: amountsError } = useMarchesPublicsYearlyAmounts(siren);
  const { data: countsData, isPending: countsPending, isError: countsError } = useMarchesPublicsYearlyCounts(siren);

  const isAmountsMode = displayMode === 'amounts';
  const isPending = isAmountsMode ? amountsPending : countsPending;
  const isError = isAmountsMode ? amountsError : countsError;
  const data = isAmountsMode ? amountsData : countsData;

  if (isPending) return <Loading style={{ height: CHART_HEIGHT }} />;
  if (isError) return <ErrorFetching style={{ height: CHART_HEIGHT }} />;

  const initialList: BarChartData = [];
  for (let i = 0; i <= 7; i++) {
    initialList.push({
      year: new Date(Date.now()).getFullYear() - 7 + i,
      value: 0,
    });
  }

  const chartData: BarChartData = initialList.map((el) => {
    const found = data.find((item) => item.year === el.year);
    const value = isAmountsMode 
      ? (found as any)?.amount ?? el.value
      : (found as any)?.count ?? el.value;
    return { ...el, value };
  });

  // Check if all data is zero (no data state)
  const hasNoData = !data || data.length === 0 || chartData.every(item => item.value === 0);

  return <BarChart 
    data={chartData} 
    displayMode={displayMode} 
    barColor={barColor} 
    borderColor={borderColor}
    hasNoData={hasNoData}
    siren={siren}
  />;
}

const LEGEND_LABELS = {
  amounts: 'Montant des marchés publics publiées (€)',
  counts: 'Nombre de marchés publics publiées',
};

function getLegendFormatter(displayMode: 'amounts' | 'counts'): string {
  return LEGEND_LABELS[displayMode];
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
  displayMode: 'amounts' | 'counts';
  barColor: string;
  borderColor: string;
  hasNoData: boolean;
  siren?: string;
};

function BarChart({ data, displayMode, barColor, borderColor, hasNoData, siren }: BarChartProps) {
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
            formatter={() => getLegendFormatter(displayMode)} 
            wrapperStyle={{ 
              color: '#000000 !important', 
              fontWeight: 600,
              paddingTop: '10px'
            }}
            iconType="rect"
          />
          <Bar dataKey='value' fill={barColor} stroke={borderColor} strokeWidth={1} radius={[0, 16, 16, 0]}>
            <LabelList position='right' formatter={formatLabel} fill='#303F8D' fontSize={14} fontWeight={700} />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    );
  }

  // Pour desktop : graphique vertical
  // Si pas de données, afficher une seule barre avec le message et le bouton
  if (hasNoData && !isMobile) {
    const currentYear = new Date().getFullYear();
    const noDataChart = [{
      year: currentYear,
      value: 1, // Valeur factice pour afficher une barre
    }];

    return (
      <div className='flex flex-col items-center justify-center' style={{ height: CHART_HEIGHT }}>
        <div className='relative flex flex-col items-center'>
          {/* Bouton Interpeller au-dessus de la barre */}
          <ActionButton
            onClick={handleInterpellerClick}
            icon={<MessageSquare size={20} />}
            variant='default'
            className='mb-4 bg-primary hover:bg-primary/90 text-white'
          />
          
          {/* Graphique avec une seule barre */}
          <ResponsiveContainer width={200} height={200}>
            <RechartsBarChart
              data={noDataChart}
              margin={{ top: 0, right: 0, left: 0, bottom: 30 }}
            >
              <XAxis 
                dataKey='year' 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 14, fill: '#303F8D' }}
              />
              <Bar dataKey='value' fill='#F4D93E' radius={[16, 0, 0, 0]}>
                <Cell />
                <LabelList 
                  position='center' 
                  content={() => (
                    <text 
                      x={100} 
                      y={100} 
                      fill='#303F8D' 
                      textAnchor="middle"
                      fontSize={14}
                      fontWeight={700}
                    >
                      <tspan x={100} dy={-10}>Aucunes</tspan>
                      <tspan x={100} dy={20}>données</tspan>
                      <tspan x={100} dy={20}>publiées</tspan>
                    </text>
                  )}
                />
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
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
          formatter={() => getLegendFormatter(displayMode)} 
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