import React from 'react';

type ComparisonData = {
  year: string;
  community: number;
  communityLabel: string;
  regional: number;
  regionalLabel: string;
};

type MobileComparisonChartProps = {
  data: ComparisonData[];
};

// Mobile horizontal bar chart component - mobile-v1
export default function MobileComparisonChart({ data }: MobileComparisonChartProps) {
  if (!data.length) return null;

  const formatMobileValue = (value: number) => {
    if (value >= 1000000000) {
      return `${Math.round(value / 1000000000)}Md`;
    }
    if (value >= 1000000) {
      return `${Math.round(value / 1000000)}M`;
    }
    if (value >= 1000) {
      return `${Math.round(value / 1000)}k`;
    }
    return `${value}`;
  };

  const maxValue = Math.max(...data.flatMap(d => [d.community, d.regional]));

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="space-y-4">
        {data.map((yearData) => (
          <div key={yearData.year} className="flex items-center gap-3">
            {/* Year label */}
            <div className="w-8 text-sm font-medium text-gray-700">
              {yearData.year}
            </div>
            
            {/* Bars container */}
            <div className="flex-1 space-y-1">
              {/* Community bar (solid) */}
              <div className="relative flex items-center">
                <div className="w-full bg-white rounded h-4 relative overflow-hidden">
                  <div
                    className="bg-[#303F8D] h-4 transition-all duration-500"
                    style={{ 
                      width: `${Math.max((yearData.community / maxValue) * 100, 8)}%`,
                      borderRadius: '0 12px 12px 0'
                    }}
                  >
                  </div>
                </div>
                <span className="text-[#303F8D] text-xs font-bold ml-2 min-w-fit">
                  {formatMobileValue(yearData.community)}
                </span>
              </div>

              {/* Regional bar (striped) */}
              <div className="relative flex items-center">
                <div className="w-full bg-white rounded h-4 relative overflow-hidden">
                  <div
                    className="h-4 transition-all duration-500"
                    style={{ 
                      width: `${Math.max((yearData.regional / maxValue) * 100, 8)}%`,
                      background: `repeating-linear-gradient(
                        45deg,
                        #303F8D,
                        #303F8D 3px,
                        white 3px,
                        white 6px
                      )`,
                      borderRadius: '0 12px 12px 0'
                    }}
                  >
                  </div>
                </div>
                <span className="text-[#303F8D] text-xs font-bold ml-2 min-w-fit">
                  {formatMobileValue(yearData.regional)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom scale */}
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500 px-11">
        <span>0M</span>
        <span>20M €</span>
        <span>40M €</span>
        <span>60M €</span>
        <span>80M €</span>
      </div>
    </div>
  );
}