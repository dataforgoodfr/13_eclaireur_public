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

const SVG_CONFIG = {
  viewBoxWidth: scoreValues.length * (SQUARE_SIZE + GAP),
  viewBoxHeight: SQUARE_SIZE * 2,
  margin: 20,
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
};

export function TransparencyScoreBar({ score: activeScore }: TransparencyScoreBarProps) {
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

  return (
    <svg
      width={SVG_CONFIG.viewBoxWidth + 2 * SVG_CONFIG.margin}
      height={SVG_CONFIG.viewBoxHeight}
      viewBox={`0 0 ${SVG_CONFIG.viewBoxWidth + 2 * SVG_CONFIG.margin} ${SVG_CONFIG.viewBoxHeight}`}
    >
      <g transform={`translate(${SVG_CONFIG.margin}, ${SVG_CONFIG.margin})`}>
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

      <g transform={`translate(${SVG_CONFIG.margin}, ${SVG_CONFIG.margin})`}>
        <text
          x={SVG_CONFIG.viewBoxWidth / 2}
          y={SQUARE_SIZE + 25}
          textAnchor='middle'
          className='font-bold fill-blue-900 text-lg'
        >
          {activeScore === TransparencyScore.UNKNOWN || activeScore === null
            ? 'Non communiqué'
            : SCORE_TO_ADJECTIF[activeScore]
          }
        </text>
      </g>
    </svg>
  );
}
