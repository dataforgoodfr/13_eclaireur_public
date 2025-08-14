"use client"

import MobileChart from '../MobileChart';

type ComparisonData = {
    year: string;
    community: number;
    communityLabel: string;
    regional: number;
    regionalLabel: string;
};

type MobileComparisonChartProps = {
    data: ComparisonData[];
    dataLoading: boolean;
};

export default function MobileComparisonChartV2({ data, dataLoading }: MobileComparisonChartProps) {
    if (!data || data.length === 0) {
        return <div className="text-gray-500 text-center p-4">Aucune donnée disponible</div>;
    }

    // Transform data for MobileChart format
    const mobileChartData = data.map(item => ({
        year: item.year,
        primary: item.regional,
        primaryLabel: item.regionalLabel,
        secondary: item.community,
        secondaryLabel: item.communityLabel,
    }));

    return (
        <MobileChart 
            data={mobileChartData}
            dataLoading={dataLoading}
            mode="dual"
            primaryColor="#303F8D"
            secondaryColor="url(#stripes)"
        />
    );
}