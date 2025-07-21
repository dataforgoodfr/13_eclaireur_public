import { SVGProps } from 'react';

import {
  SCORE_NON_DISPONIBLE,
  SCORE_TO_ADJECTIF,
  TransparencyScore,
} from '@/components/TransparencyScore/constants';
import { cn } from '@/utils/utils';
import { ClassNameValue } from 'tailwind-merge';

const SQUARE_WIDTH = 60;
const ACTIVE_SCORE_SCALE = 1.2;

const SVG_CONFIG = {
  viewBoxWidth: SQUARE_WIDTH * 5 + 40,
  viewBoxHeight: SQUARE_WIDTH * 2,
  margin: 20,
};

type ScoreTileProps = {
  score: TransparencyScore;
  // x: number;
  size?: number;
  rectangleClassName?: ClassNameValue;
} & SVGProps<SVGGElement>;

function ScoreTile({
  score,
  // x,
  size = SQUARE_WIDTH,
  rectangleClassName,
  ...restProps
}: ScoreTileProps) {
  return (
    <g key={score} {...restProps}>
      <rect
        width={size}
        height={size}
        strokeWidth={1}
        className={cn('fill-transparent stroke-slate-400', rectangleClassName)}
      />
      <text x={SQUARE_WIDTH * 0.5} y={SQUARE_WIDTH / 2 + 5} textAnchor='middle'>
        {score}
      </text>
    </g>
  );
}

type TransparencyScoreBarProps = {
  score: TransparencyScore | null;
};

export function TransparencyScoreBar({ score: activeScore }: TransparencyScoreBarProps) {
  function isActiveScore(scoreValue: TransparencyScore) {
    return scoreValue === activeScore;
  }

  const scoreValues = Object.values(TransparencyScore);
  const activeScoreIndex =
    activeScore === null ? 2 : scoreValues.findIndex((scorevalue) => scorevalue === activeScore);

  const translateDueToScaleFactor = -5;

  return (
    <svg
      width={SVG_CONFIG.viewBoxWidth}
      height={SVG_CONFIG.viewBoxHeight}
      viewBox={`0 0 ${SVG_CONFIG.viewBoxWidth} ${SVG_CONFIG.viewBoxHeight}`}
    >
      <g transform={`translate(${SVG_CONFIG.margin}, ${SVG_CONFIG.margin})`}>
        {scoreValues.map((scoreValue, i) => {
          if (isActiveScore(scoreValue)) return null;

          return (
            <g key={scoreValue}>
              <ScoreTile
                score={scoreValue}
                x={SQUARE_WIDTH * i}
                transform={`translate(${SQUARE_WIDTH * i}, 0)`}
              />
            </g>
          );
        })}
        {activeScore !== null && (
          <g className='font-bold'>
            <ScoreTile
              score={activeScore}
              x={SQUARE_WIDTH * activeScoreIndex}
              transform={`scale(${ACTIVE_SCORE_SCALE}) translate(${(SQUARE_WIDTH * activeScoreIndex) / ACTIVE_SCORE_SCALE + translateDueToScaleFactor}, ${translateDueToScaleFactor})`}
              rectangleClassName='fill-slate-200'
            />
          </g>
        )}
      </g>
      <g transform={`translate(${SVG_CONFIG.margin}, ${SVG_CONFIG.margin})`}>
        <text
          x={SQUARE_WIDTH * (activeScoreIndex + 0.5)}
          y={SQUARE_WIDTH + 25}
          textAnchor='middle'
          className='font-bold'
        >
          {activeScore !== null && SCORE_TO_ADJECTIF[activeScore]}
          {activeScore === null && SCORE_NON_DISPONIBLE}
        </text>
      </g>
    </svg>
  );
}
