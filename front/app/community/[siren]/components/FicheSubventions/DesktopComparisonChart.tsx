import ComparisonChart, { type ComparisonData } from '#components/DataViz/ComparisonChart';
import { SUBVENTIONS_THEME } from '#utils/comparisonThemes';

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
      theme={SUBVENTIONS_THEME}
    />
  );
}
