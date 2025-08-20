import { SVGProps } from 'react';

import {
  SCORE_TO_ADJECTIF,
  TransparencyScore,
} from '#components/TransparencyScore/constants';
import { cn } from '#utils/utils';
import { ClassNameValue } from 'tailwind-merge';

const SQUARE_SIZE = 60;
const CORNER_RADIUS = 12;
const ACTIVE_SCORE_SCALE = 1.2;
const GAP = 10;

const scoreValues = Object.values(TransparencyScore).filter(score => score !== TransparencyScore.UNKNOWN);

const SCALE_PADDING = SQUARE_SIZE * (ACTIVE_SCORE_SCALE - 1) / 2; // Space needed for scaled tile

const SVG_CONFIG = {
  viewBoxWidth: scoreValues.length * (SQUARE_SIZE + GAP) - GAP + 2 * SCALE_PADDING,
  viewBoxHeight: SQUARE_SIZE + SCALE_PADDING + 35, // Add padding on top + space for text
  padding: SCALE_PADDING,
};

type ScoreTileProps = {
  score: TransparencyScore;
  rectangleClassName?: ClassNameValue;
  size?: number;
} & SVGProps<SVGGElement>;

function getCustomRoundedRectPath(width: number, height: number, r: number) {
  return `
    M 0,0
    L ${width},0
    L ${width},${height - r}
    Q ${width},${height} ${width - r},${height}
    L 0,${height}
    L 0,${r}
    Q 0,0 ${r},0
    Z
  `;
}

function ScoreTile({
  score,
  rectangleClassName,
  size = SQUARE_SIZE,
  ...restProps
}: ScoreTileProps) {
  return (
    <g {...restProps}>
      <path
        d={getCustomRoundedRectPath(size, size, CORNER_RADIUS)}
        className={cn(rectangleClassName)}
        strokeWidth={1}
      />
      <text
        x={size / 2}
        y={size / 2 + 5 / 2}
        textAnchor='middle'
        dominantBaseline='middle'
        className='fill-blue-900 font-bold'
      >
        {score}
      </text>
    </g>
  );
}

type TransparencyScoreBarProps = {
  score: TransparencyScore | null;
  className?: string;
  responsive?: boolean;
};

export function TransparencyScoreBar({ score: activeScore, className, responsive = true }: TransparencyScoreBarProps) {
  const translateDueToScaleFactor = -5;

  const getScoreColor = (score: TransparencyScore) => {
    switch (score) {
      case TransparencyScore.A:
        return 'fill-score-A';
      case TransparencyScore.B:
        return 'fill-score-B';
      case TransparencyScore.C:
        return 'fill-score-C';
      case TransparencyScore.D:
        return 'fill-score-D';
      case TransparencyScore.E:
        return 'fill-score-E';
      default:
        return 'fill-muted-light';
    }
  };

  // Calculate text position - clamp to keep it within bounds
  const getTextXPosition = () => {
    if (!activeScore || activeScore === TransparencyScore.UNKNOWN) {
      return SVG_CONFIG.viewBoxWidth / 2;
    }
    
    const scoreIndex = scoreValues.indexOf(activeScore);
    const idealX = SVG_CONFIG.padding + scoreIndex * (SQUARE_SIZE + GAP) + SQUARE_SIZE / 2;
    const minX = 60; // Minimum X to avoid text cutoff on left
    // More space on right for "Très insuffisant" (score E)
    const maxX = SVG_CONFIG.viewBoxWidth - 90; 
    
    return Math.max(minX, Math.min(maxX, idealX));
  };

  return (
    <svg
      className={cn(responsive && 'w-full h-auto max-w-md', className)}
      width={!responsive ? SVG_CONFIG.viewBoxWidth : undefined}
      height={!responsive ? SVG_CONFIG.viewBoxHeight : undefined}
      viewBox={`0 0 ${SVG_CONFIG.viewBoxWidth} ${SVG_CONFIG.viewBoxHeight}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={`translate(${SVG_CONFIG.padding}, ${SVG_CONFIG.padding})`}>
        {scoreValues.map((scoreValue, i) => {
          const baseX = i * (SQUARE_SIZE + GAP);

          const isActive = scoreValue === activeScore;

          return (
            <ScoreTile
              key={scoreValue}
              score={scoreValue}
              transform={
                isActive
                  ? `translate(${baseX}, 0) scale(${ACTIVE_SCORE_SCALE}) translate(${translateDueToScaleFactor}, ${translateDueToScaleFactor})`
                  : `translate(${baseX}, 0)`
              }
              rectangleClassName={isActive ? getScoreColor(scoreValue) : 'fill-muted-light'}
            />
          );
        })}
      </g>

      <text
        x={getTextXPosition()}
        y={SVG_CONFIG.padding + SQUARE_SIZE + 25}
        textAnchor='middle'
        className='font-bold fill-blue-900 text-lg'
      >
        {activeScore === TransparencyScore.UNKNOWN || activeScore === null
          ? 'Non communiqué'
          : SCORE_TO_ADJECTIF[activeScore]
        }
      </text>
    </svg>
  );
}
