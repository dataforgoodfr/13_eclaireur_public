"use client"

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Common data structure for both evolution and comparison
type MobileChartData = {
    year: string | number;
    primary: number;
    primaryLabel?: string;
    secondary?: number;
    secondaryLabel?: string;
};

type MobileChartProps = {
    data: MobileChartData[];
    dataLoading?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    mode?: 'single' | 'dual'; // single for evolution, dual for comparison
    formatValue?: (value: number) => string;
    labelColor?: string;
};

const defaultFormatValue = (value: number) => {
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

export default function MobileChart({
    data,
    dataLoading = false,
    primaryColor = '#303F8D',
    secondaryColor = 'url(#stripes)',
    mode = 'single',
    formatValue = defaultFormatValue,
    labelColor = '#303F8D'
}: MobileChartProps) {
    if (!data || data.length === 0) {
        return <div className="text-gray-500 text-center p-4">Aucune donnée disponible</div>;
    }

    // Calculate the maximum value across all data to normalize bar sizes
    const allValues = data.flatMap(d => mode === 'dual' && d.secondary !== undefined
        ? [d.primary, d.secondary]
        : [d.primary]
    );
    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
    const chartMax = Math.round(maxValue * 1.1); // Add 10% padding

    return (
        <div className="bg-white rounded-lg overflow-hidden">
            <div className="relative">
                {dataLoading && (
                    <div className="absolute inset-0 bg-white/70 z-10 flex items-center justify-center rounded-lg">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                            <span className="text-sm">Mise à jour...</span>
                        </div>
                    </div>
                )}

                <div className="space-y-1 p-4 overflow-x-auto">
                    {data.map((item) => (
                        <div key={item.year} className="flex items-center gap-2 py-1 min-w-0">
                            <div className="w-10 text-sm font-medium text-gray-700 flex-shrink-0">{item.year}</div>
                            <div className="flex-1 min-w-0">
                                <ResponsiveContainer width="100%" height={mode === 'dual' ? 60 : 30}>
                                    <BarChart
                                        data={[item]}
                                        layout="vertical"
                                        margin={{ left: 0, right: 60, top: 2, bottom: 2 }}
                                    >
                                        <XAxis hide type="number" domain={[0, chartMax]} />
                                        <YAxis hide type="category" />

                                        {/* Primary bar */}
                                        <Bar dataKey="primary" barSize={24} radius={[0, 0, 4, 0]}>
                                            <Cell fill={primaryColor} stroke="#E5E7EB" strokeWidth={1} />
                                            <LabelList
                                                dataKey="primary"
                                                position="right"
                                                formatter={formatValue}
                                                style={{ 
                                                    fontSize: "24px", 
                                                    fill: labelColor, 
                                                    fontWeight: "700", 
                                                    fontFamily: "var(--font-kanit)",
                                                    stroke: "none",
                                                    textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                                                }}
                                            />
                                        </Bar>

                                        {/* Secondary bar (only in dual mode) */}
                                        {mode === 'dual' && item.secondary !== undefined && (
                                            <Bar dataKey="secondary" barSize={24} radius={[0, 0, 4, 0]} y={30}>
                                                <Cell fill={secondaryColor} stroke="#E5E7EB" strokeWidth={1} />
                                                <LabelList
                                                    dataKey="secondary"
                                                    position="right"
                                                    formatter={formatValue}
                                                    style={{ 
                                                        fontSize: "24px", 
                                                        fill: labelColor, 
                                                        fontWeight: "700", 
                                                        fontFamily: "var(--font-kanit)",
                                                        stroke: "none",
                                                        textShadow: "0 1px 2px rgba(0,0,0,0.1)"
                                                    }}
                                                />
                                            </Bar>
                                        )}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SVG pattern for stripes (used in dual mode) */}
            <svg width="0" height="0">
                <defs>
                    <pattern id="stripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                        <rect width="4" height="8" fill="#303F8D" />
                        <rect x="4" width="4" height="8" fill="white" />
                    </pattern>
                </defs>
            </svg>
        </div>
    );
}