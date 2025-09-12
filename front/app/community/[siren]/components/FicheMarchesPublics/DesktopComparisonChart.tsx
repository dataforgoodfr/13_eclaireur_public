import ComparisonChart, { type ComparisonData } from '#components/DataViz/ComparisonChart';
import { MARCHES_PUBLICS_THEME } from '#utils/comparisonThemes';

type DesktopChartProps = {
  data: ComparisonData[];
  dataLoading: boolean;
  siren?: string;
};

export default function DesktopComparisonChart({ data, dataLoading, siren }: DesktopChartProps) {
  return (
    <ComparisonChart
      data={data}
      dataLoading={dataLoading}
      siren={siren}
      theme={MARCHES_PUBLICS_THEME}
    />
  );
}
