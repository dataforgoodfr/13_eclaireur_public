import type { Community } from '#app/models/community';
import {
  SCORE_TO_ADJECTIF,
  SCORE_TRANSPARENCY_COLOR,
} from 'components/TransparencyScore/constants';

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
      className='pointer-events-none absolute z-50 rounded-tl-br-xl border border-primary bg-white p-4 text-primary'
      style={{ left: x + 10, top: y + 10 }}
    >
      {data ? (
        <>
          <h4 className='mb-2'>{data.nom}</h4>
          <div className='flex flex-col gap-2'>
            <div className='grid w-2/3 grid-cols-2 gap-x-2'>
              <p className='font-kanit-bold text-[16px] font-light leading-[24px] text-primary'>
                Population
              </p>
              <p className='text-right font-kanit-bold text-[16px] font-bold leading-[24px] text-primary'>
                {data.population?.toLocaleString() ?? 'N/A'}
              </p>
              <p className='font-kanit-bold text-[16px] font-light leading-[24px] text-primary'>
                Siren
              </p>
              <p className='text-right font-kanit-bold text-[16px] font-bold leading-[24px] text-primary'>
                {data.siren ?? 'N/A'}
              </p>
              <p className='font-kanit-bold text-[16px] font-light leading-[24px] text-primary'>
                Code
              </p>
              <p className='text-right font-kanit-bold text-[16px] font-bold leading-[24px] text-primary'>
                {data.code_insee}
              </p>
            </div>
            <div className='grid grid-cols-2 gap-x-4'>
              <div className='flex flex-col'>
                <p className='font-kanit-bold text-[16px] font-light leading-[24px] text-primary'>
                  Subventions score:
                </p>
                <div className='flex flex-row items-center'>
                  <div
                    className={`flex size-[38px] items-center justify-center rounded-tl-br-sm ${SCORE_TRANSPARENCY_COLOR[data.subventions_score || 'UNKNOWN']}`}
                  >
                    <span className='font-kanit-bold text-[16px] font-bold leading-[24px]'>
                      {data.subventions_score}
                    </span>
                  </div>
                  <p className='ml-2 font-kanit-bold text-[16px] font-bold leading-[24px]'>
                    {SCORE_TO_ADJECTIF[data.subventions_score || 'UNKNOWN']}
                  </p>
                </div>
              </div>

              <div className='flex flex-col'>
                <p className='font-kanit-bold text-[16px] font-light leading-[24px] text-primary'>
                  Subventions score:
                </p>
                <div className='flex flex-row items-center'>
                  <div
                    className={`flex size-[38px] items-center justify-center rounded-tl-br-sm ${SCORE_TRANSPARENCY_COLOR[data.mp_score || 'UNKNOWN']}`}
                  >
                    <span className='font-kanit-bold text-[16px] font-bold leading-[24px]'>
                      {data.mp_score}
                    </span>
                  </div>
                  <p className='ml-2 font-kanit-bold text-[16px] font-bold leading-[24px]'>
                    {SCORE_TO_ADJECTIF[data.mp_score || 'UNKNOWN']}
                  </p>
                </div>
              </div>
            </div>
          </div>
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
