import type { Community } from '#app/models/community';

import type { HoverInfo } from './types';
import getCommunityDataFromFeature from './utils/getCommunityDataFromFeature';

interface MapTooltipProps {
  hoverInfo: HoverInfo | null;
  communityMap: Record<string, Community>;
}

export default function MapTooltip({ hoverInfo, communityMap }: MapTooltipProps) {
  if (!hoverInfo) return null;

  const { feature, type, x, y } = hoverInfo;
  const data = getCommunityDataFromFeature(feature, communityMap);
  return (
    <div
      className='pointer-events-none absolute z-50 rounded-lg bg-white px-3 py-2 text-sm text-gray-900 shadow-md'
      style={{ left: x + 10, top: y + 10 }}
    >
      {data ? (
        <>
          <div className='font-semibold'>{data.nom}</div>
          <div className='text-xs text-gray-700'>
            Population: {data.population?.toLocaleString() ?? 'N/A'}
          </div>
          <div className='text-xs text-gray-500'>SIREN: {data.siren ?? 'N/A'}</div>
          <div className='text-xs text-gray-400'>Code: {data.code_insee}</div>
          <div className='text-xs text-gray-400'>Subventions score: {data.subventions_score}</div>
          <div className='text-xs text-gray-400'>Marches Public score: {data.mp_score}</div>
        </>
      ) : (
        <>
          <div className='text-sm text-gray-600'>Unknown {type}</div>
          <div className='text-sm text-gray-600'>{feature.properties?.name}</div>
        </>
      )}
    </div>
  );
}
