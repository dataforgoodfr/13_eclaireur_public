'use client';

import { formatMonetaryValue, getMonetaryUnit } from '#utils/utils';

import MobileChart from '../../app/community/[siren]/components/MobileChart';
import type { ComparisonData, ComparisonTheme } from './ComparisonChart';

type MobileComparisonChartProps = {
  data: ComparisonData[];
  dataLoading: boolean;
  siren?: string;
  theme: ComparisonTheme;
  hasRealData?: boolean;
};

export default function MobileComparisonChart({
  data,
  dataLoading,
  siren,
  theme,
  hasRealData = true,
}: MobileComparisonChartProps) {
  if (!data || data.length === 0) {
    return <div className='p-4 text-center text-muted'>Aucune donnée disponible</div>;
  }

  // Calculate max value for proper unit determination
  const allValues = data.flatMap((d) => [d.community, d.regional]);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const unit = getMonetaryUnit(maxValue);

  // Format function based on the chosen unit
  const formatValue = (value: number) => formatMonetaryValue(value, unit);

  // Transform data for MobileChart format
  const mobileChartData = data.map((item) => ({
    year: item.year,
    primary: item.regional,
    primaryLabel: item.regionalLabel,
    secondary: item.community,
    secondaryLabel: item.communityLabel,
    isPrimaryMissing: item.regionalMissing || item.regional === 0,
    isSecondaryMissing: item.communityMissing || item.community === 0,
  }));

  // Create striped pattern for regional data (similar to original)
  const stripedPattern = `url(#stripes-${theme.primaryColor.replace('#', '')})`;

  return (
    <div className='relative'>
      {/* Add striped pattern definition for regional data */}
      <svg width='0' height='0' style={{ position: 'absolute' }}>
        <defs>
          <pattern
            id={`stripes-${theme.primaryColor.replace('#', '')}`}
            patternUnits='userSpaceOnUse'
            width='6'
            height='6'
            patternTransform='rotate(45)'
          >
            <rect width='2' height='6' fill={theme.primaryColor} />
            <rect x='2' width='4' height='6' fill='white' />
          </pattern>
        </defs>
      </svg>

      <MobileChart
        data={mobileChartData}
        dataLoading={dataLoading}
        mode='dual'
        primaryColor={theme.primaryColor}
        secondaryColor={stripedPattern}
        formatValue={formatValue}
        labelColor={theme.secondaryColor}
        siren={siren}
        unitLabel={unit}
        hasRealData={hasRealData}
      />
    </div>
  );
}
