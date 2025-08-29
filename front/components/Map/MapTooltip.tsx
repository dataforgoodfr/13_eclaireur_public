import type { Community } from '#app/models/community';
import {
  SCORE_TO_ADJECTIF,
  SCORE_TRANSPARENCY_COLOR,
} from 'components/TransparencyScore/constants';
import { X } from 'lucide-react';

import type { HoverInfo } from './types';
import getCommunityDataFromFeature from './utils/getCommunityDataFromFeature';

interface MapTooltipProps {
  hoverInfo: HoverInfo | null;
  communityMap: Record<string, Community>;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function MapTooltip({
  hoverInfo,
  communityMap,
  isMobile = false,
  onClose,
}: MapTooltipProps) {
  if (!hoverInfo) return null;

  const { feature, type, x, y } = hoverInfo;
  const data = getCommunityDataFromFeature(feature, communityMap);

  // Mobile positioning - bottom of screen
  const tooltipStyle = isMobile
    ? {
        left: '16px',
        right: '16px',
        bottom: '16px',
        maxHeight: '60vh',
        overflow: 'auto',
      }
    : { left: x + 10, top: y + 10 };

  return (
    <div
      className={`absolute z-50 rounded-tl-br-xl border border-primary bg-white p-4 text-primary ${
        isMobile ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={tooltipStyle}
    >
      {data ? (
        <>
          {/* Close button for mobile */}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className='absolute right-2 top-2 rounded-full p-1 hover:bg-gray-100'
            >
              <X className='h-4 w-4 text-gray-500' />
            </button>
          )}
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
                    className={`flex size-[38px] items-center justify-center rounded-tl-br ${SCORE_TRANSPARENCY_COLOR[data.subventions_score || 'UNKNOWN']}`}
                  >
                    <span className='font-kanit-bold text-[28px] font-bold leading-[24px]'>
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
                  Score des Marchés publics :
                </p>
                <div className='flex flex-row items-center'>
                  <div
                    className={`flex size-[38px] items-center justify-center rounded-tl-br ${SCORE_TRANSPARENCY_COLOR[data.mp_score || 'UNKNOWN']}`}
                  >
                    <span className='font-kanit-bold text-[28px] font-bold leading-[24px]'>
                      {data.mp_score}
                    </span>
                  </div>
                  <p className='ml-2 font-kanit-bold text-[16px] font-bold leading-[24px]'>
                    {SCORE_TO_ADJECTIF[data.mp_score || 'UNKNOWN']}
                  </p>
                </div>
              </div>
            </div>
            {/* Mobile: Add link to community page */}
            {isMobile && data?.siren && (
              <div className='mt-4 border-t border-gray-200 pt-4'>
                <a
                  href={`/community/${data.siren}`}
                  className='block w-full rounded-tl-br bg-primary px-4 py-2 text-center font-medium text-white hover:bg-primary/90'
                >
                  Voir les détails
                </a>
              </div>
            )}
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
