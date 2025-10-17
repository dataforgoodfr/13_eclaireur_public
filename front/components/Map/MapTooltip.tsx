import { useRef } from 'react';

import type { Community } from '#app/models/community';
import {
  SCORE_TO_ADJECTIF,
  SCORE_TRANSPARENCY_COLOR,
  type TransparencyScore,
} from 'components/TransparencyScore/constants';
import { X } from 'lucide-react';

import type { HoverInfo } from './types';
import getCommunityDataFromFeature from './utils/getCommunityDataFromFeature';

interface ScoreDisplayProps {
  label: string;
  score: TransparencyScore | null | undefined;
}

function ScoreDisplay({ label, score }: ScoreDisplayProps) {
  const displayScore = score || 'UNKNOWN';
  return (
    <div className='flex flex-col gap-1'>
      <p className='font-kanit-bold text-sm text-primary'>{label}</p>
      <div className='flex flex-row items-center gap-2'>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-tl-br ${SCORE_TRANSPARENCY_COLOR[displayScore]}`}
        >
          <span className='font-kanit-bold text-[24px] font-bold leading-[24px]'>
            {score || '?'}
          </span>
        </div>
        <p className='font-kanit-bold text-sm text-primary'>{SCORE_TO_ADJECTIF[displayScore]}</p>
      </div>
    </div>
  );
}

interface MapTooltipProps {
  hoverInfo: HoverInfo | null;
  communityMap: Record<string, Community>;
  mapLimit?: { x: number; y: number };
  isMobile?: boolean;
  onClose?: () => void;
}

// Helper function to convert text to title case
function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function MapTooltip({
  hoverInfo,
  communityMap,
  mapLimit,
  isMobile = false,
  onClose,
}: MapTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  if (!hoverInfo) return null;

  const { feature, x, y } = hoverInfo;
  const data = getCommunityDataFromFeature(feature, communityMap);
  const titleText = data?.nom || feature.properties?.name || '-';
  const formattedTitle = titleText !== '-' ? toTitleCase(titleText) : titleText;
  const minWidth = 300;
  const tooltipBoundingRect = tooltipRef.current?.getBoundingClientRect();
  const isOutsideMapX = mapLimit && tooltipBoundingRect && x > mapLimit.x - minWidth;
  const left = isOutsideMapX ? x - tooltipBoundingRect.width - 10 : x + 10;
  const isOutsideMapY =
    mapLimit && tooltipBoundingRect && y > mapLimit.y - tooltipBoundingRect.height;
  const top = isOutsideMapY ? y - tooltipBoundingRect.height - 10 : y + 10;
  // Mobile positioning - bottom of screen
  const tooltipStyle = isMobile
    ? {
        left: '16px',
        right: '16px',
        bottom: '16px',
        maxHeight: '60vh',
        overflow: 'auto',
      }
    : { left, top, minWidth };

  return (
    <div
      className={`fixed z-[100] rounded-tl-br-xl border border-primary bg-white p-4 text-primary ${
        isMobile ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      ref={tooltipRef}
      style={tooltipStyle}
    >
      <>
        {/* Close button for mobile */}
        {isMobile && onClose && (
          <button
            type='button'
            onClick={onClose}
            className='absolute right-2 top-2 rounded-full p-1 hover:bg-gray-100'
          >
            <X className='h-4 w-4 text-gray-500' />
          </button>
        )}
        <h4 className='mb-4 text-xl font-semibold'>{formattedTitle}</h4>
        <div className='flex flex-col gap-2'>
          <div className='grid w-2/3 grid-cols-2 gap-x-2'>
            <p className='leading-2xl font-kanit-bold text-base font-light text-primary'>
              Population
            </p>
            <p className='leading-2xl text-right font-kanit-bold text-base font-bold text-primary'>
              {data?.population?.toLocaleString() ?? '-'}
            </p>
            <p className='leading-2xl font-kanit-bold text-base font-light text-primary'>Siren</p>
            <p className='leading-2xl text-right font-kanit-bold text-base font-bold text-primary'>
              {data?.siren ?? '-'}
            </p>
            <p className='leading-2xl font-kanit-bold text-base font-light text-primary'>Code</p>
            <p className='leading-2xl text-right font-kanit-bold text-base font-bold text-primary'>
              {data?.code_insee ?? '-'}
            </p>
          </div>
          <div className='grid grid-cols-2 gap-x-4'>
            <ScoreDisplay label='Marchés publics' score={data?.mp_score} />
            <ScoreDisplay label='Subventions' score={data?.subventions_score} />
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
    </div>
  );
}
