"use client"

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";

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
        return <div className="text-gray-500 text-center p-4">No data available</div>;
    }
    const formatValue = (value: number) => {
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(0)} Md €`;
        }
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(0)} M €`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)} k €`;
        }
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };

    // Calculate the maximum value across all data to normalize bar sizes
    const allValues = data.flatMap(d => [d.regional, d.community]);
    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
    const chartMax = Math.round(maxValue * 1.1); // Add 10% padding

    return (

        <div className="relative">
            {dataLoading && (
                <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        <span>Mise à jour des données...</span>
                    </div>
                </div>
            )}


            <div className="space-y-1">
                {data.map((item) => (
                    <div key={item.year} className="flex items-center gap-2 py-1">
                        <div className="w-10 text-sm font-medium text-gray-700">{item.year}</div>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height={40}>
                                <BarChart data={[item]} layout="vertical" margin={{ left: 0, right: 80, top: 2, bottom: 2 }}>
                                    <XAxis hide type="number" domain={[0, chartMax]} />
                                    <YAxis hide type="category" />

                                    <Bar dataKey="regional" barSize={18} radius={[0, 0, 4, 0]}>
                                        <Cell fill="#303F8D" stroke="#303F8D" strokeWidth={1} />
                                        <LabelList
                                            dataKey="regional"
                                            position="right"
                                            formatter={formatValue}
                                            style={{ fontSize: "12px", fill: "#303F8D", fontWeight: "600" }}
                                        />
                                    </Bar>

                                    <Bar dataKey="community" barSize={18} radius={[0, 0, 4, 0]} y={24}>
                                        <Cell fill="url(#stripes)" stroke="#303F8D" strokeWidth={1} />
                                        <LabelList
                                            dataKey="community"
                                            position="right"
                                            formatter={formatValue}
                                            style={{ fontSize: "12px", fill: "#303F8D", fontWeight: "600" }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            <svg width="0" height="0">
                <defs>
                    <pattern id="stripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                        <rect width="4" height="8" fill="#303F8D" />
                        <rect x="4" width="4" height="8" fill="white" />
                    </pattern>
                </defs>
            </svg>
        </div>
    )
}