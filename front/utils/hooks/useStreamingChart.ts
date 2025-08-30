import { useEffect, useMemo, useState } from 'react';

import {
  generatePlaceholderByType,
  hasRealData,
  mergeWithRealData,
} from '../placeholderDataGenerators';

/**
 * Hook that manages the streaming chart pattern:
 * 1. Shows placeholder bars immediately (no numbers)
 * 2. Transitions to real data when available
 * 3. Provides flags for conditional rendering
 */

export type ChartStreamingState = {
  data: Array<{ year: number; value: number }>;
  hasRealData: boolean;
  isError: boolean;
  isLoading: boolean;
};

export type UseStreamingChartOptions = {
  chartType: 'subventions' | 'marches-publics';
  displayMode: 'amounts' | 'counts';
};

export function useStreamingChart(
  realData: Array<{ year: number; amount?: number; count?: number }> | null | undefined,
  isPending: boolean,
  isError: boolean,
  options: UseStreamingChartOptions,
): ChartStreamingState {
  const { chartType, displayMode } = options;

  // Generate placeholder data based on chart type
  const placeholderData = useMemo(() => {
    return generatePlaceholderByType(chartType);
  }, [chartType]);

  // Determine if we have real data
  const dataHasRealValues = useMemo(() => {
    return hasRealData(realData);
  }, [realData]);

  // Merge placeholder with real data when available
  const chartData = useMemo(() => {
    return mergeWithRealData(placeholderData, realData, displayMode);
  }, [placeholderData, realData, displayMode]);

  return {
    data: chartData,
    hasRealData: dataHasRealValues,
    isError,
    isLoading: isPending,
  };
}

/**
 * Enhanced version with refresh capability (for future streaming updates)
 */
export function useStreamingChartWithRefresh(
  realData: Array<{ year: number; amount?: number; count?: number }> | null | undefined,
  isPending: boolean,
  isError: boolean,
  options: UseStreamingChartOptions & {
    refreshInterval?: number; // in milliseconds
    enableRefresh?: boolean;
  },
): ChartStreamingState & {
  lastUpdated: Date | null;
} {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const basicState = useStreamingChart(realData, isPending, isError, options);

  // Track when real data arrives
  useEffect(() => {
    if (basicState.hasRealData && !lastUpdated) {
      setLastUpdated(new Date());
    }
  }, [basicState.hasRealData, lastUpdated]);

  // Future: Add refresh logic here if needed
  useEffect(() => {
    if (options.enableRefresh && options.refreshInterval && basicState.hasRealData) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
        // Future: trigger data refetch here
      }, options.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [options.enableRefresh, options.refreshInterval, basicState.hasRealData]);

  return {
    ...basicState,
    lastUpdated,
  };
}
