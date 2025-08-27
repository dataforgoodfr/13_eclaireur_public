"use client"

import { ActionButton } from '#components/ui/action-button';
import { formatMonetaryValue, getMonetaryUnit } from '#utils/utils';
import { MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    siren?: string;
};

export default function MobileComparisonChart({ data, dataLoading, siren }: MobileComparisonChartProps) {
    const router = useRouter();

    if (!data || data.length === 0) {
        return <div className="text-muted text-center p-4">Aucune donnée disponible</div>;
    }

    // Calculate max value for proper unit determination
    const allValues = data.flatMap(d => [d.community, d.regional]);
    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
    const unit = getMonetaryUnit(maxValue);

    // Format function based on the chosen unit
    const formatValue = (value: number) => formatMonetaryValue(value, unit);

    // Check if any data is missing
    const hasNoData = data.some(item => item.community === 0 || item.regional === 0);

    const handleInterpellerClick = () => {
        if (siren) {
            router.push(`/interpeller/${siren}/step1`);
        }
    };

    // Transform data for MobileChart format
    const mobileChartData = data.map(item => ({
        year: item.year,
        primary: item.regional,
        primaryLabel: item.regionalLabel,
        secondary: item.community,
        secondaryLabel: item.communityLabel,
    }));

    return (
        <div className="relative">
            {hasNoData && siren && (
                <div className="absolute top-2 right-2 z-10">
                    <ActionButton
                        onClick={handleInterpellerClick}
                        icon={<MessageSquare size={16} />}
                        variant='default'
                        text="Interpeller"
                    />
                </div>
            )}

            <MobileChart
                data={mobileChartData}
                dataLoading={dataLoading}
                mode="dual"
                primaryColor="#E8F787"
                secondaryColor="url(#stripes)"
                formatValue={formatValue}
            />
        </div>
    );
}