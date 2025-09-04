'use client';

import {
  ScoreTile,
  TransparencyScoreBar,
  getScoreColor,
} from '#components/TransparencyScore/TransparencyScoreBar';
import { SCORE_TO_ADJECTIF, TransparencyScore } from '#components/TransparencyScore/constants';
import { Card } from '#components/ui/card';
import SectionSeparator from '#components/utils/SectionSeparator';
import { useTransparencyScore } from '#utils/hooks/comparison/useTransparencyScore';

import { useComparisonYear } from './hooks/useComparisonYear';
import { SideBySideComparison } from './shared/SideBySideComparison';

type TransparencyComparisonProperties = {
  siren1: string;
  siren2: string;
};

export function TransparencyComparison({ siren1, siren2 }: TransparencyComparisonProperties) {
  const { year: selectedYear, setYear: setSelectedYear } = useComparisonYear();

  return (
    <>
      <SectionSeparator
        sectionTitle='Scores de transparence'
        year={selectedYear}
        onSelectYear={setSelectedYear}
      />

      {/* Desktop layout */}
      <div className='hidden md:block'>
        <SideBySideComparison
          leftChild={<ComparingScore siren={siren1} year={selectedYear as number} />}
          rightChild={<ComparingScore siren={siren2} year={selectedYear as number} />}
        />
      </div>

      {/* Mobile layout - unified card */}
      <div className='my-6 md:hidden'>
        <MobileComparisonCard siren1={siren1} siren2={siren2} year={selectedYear as number} />
      </div>
    </>
  );
}

type ComparingScoreProperties = {
  siren: string;
  year: number;
};

function ComparingScore({ siren, year }: ComparingScoreProperties) {
  const { data, isPending, isError } = useTransparencyScore(siren, year);

  return (
    <div className='flex flex-col items-center justify-center gap-4 text-center md:gap-8'>
      <div>
        <h3 className='mb-2'>Transparence des subventions</h3>
        <div className='max-md:hidden'>
          <TransparencyScoreBar
            score={data?.subventions_score || null}
            isPending={isPending}
            isError={isError}
          />
        </div>
        <div className='flex flex-col items-center gap-2 md:hidden'>
          <svg width='60' height='60' viewBox='0 0 60 60'>
            {data?.subventions_score && !isPending && !isError ? (
              <ScoreTile
                score={data.subventions_score}
                rectangleClassName={getScoreColor(data.subventions_score)}
              />
            ) : (
              <ScoreTile score={TransparencyScore.UNKNOWN} rectangleClassName='fill-muted-light' />
            )}
          </svg>
          <h4 className=''>
            {data?.subventions_score && !isPending && !isError
              ? SCORE_TO_ADJECTIF[data.subventions_score]
              : isPending
                ? ''
                : 'Non communiqué'}
          </h4>
        </div>
      </div>

      <div>
        <h3 className='mb-2'>Transparence des marchés publics</h3>
        <div className='max-md:hidden'>
          <TransparencyScoreBar
            score={data?.mp_score || null}
            isPending={isPending}
            isError={isError}
          />
        </div>
        <div className='flex flex-col items-center gap-2 md:hidden'>
          <svg width='60' height='60' viewBox='0 0 60 60'>
            {data?.mp_score && !isPending && !isError ? (
              <ScoreTile score={data.mp_score} rectangleClassName={getScoreColor(data.mp_score)} />
            ) : (
              <ScoreTile score={TransparencyScore.UNKNOWN} rectangleClassName='fill-muted-light' />
            )}
          </svg>
          <h4>
            {data?.mp_score && !isPending && !isError
              ? SCORE_TO_ADJECTIF[data.mp_score]
              : isPending
                ? ''
                : 'Non communiqué'}
          </h4>
        </div>
      </div>
    </div>
  );
}

type MobileComparisonCardProps = {
  siren1: string;
  siren2: string;
  year: number;
};

function MobileComparisonCard({ siren1, siren2, year }: MobileComparisonCardProps) {
  const {
    data: data1,
    isPending: isPending1,
    isError: isError1,
  } = useTransparencyScore(siren1, year);
  const {
    data: data2,
    isPending: isPending2,
    isError: isError2,
  } = useTransparencyScore(siren2, year);

  const renderScoreTile = (
    score: TransparencyScore | null | undefined,
    isPending: boolean,
    isError: boolean,
    label: string,
  ) => (
    <div className='flex flex-col items-center gap-2'>
      <svg width='60' height='60' viewBox='0 0 60 60'>
        {score && !isPending && !isError ? (
          <ScoreTile score={score} rectangleClassName={getScoreColor(score)} />
        ) : (
          <ScoreTile score={TransparencyScore.UNKNOWN} rectangleClassName='fill-muted-light' />
        )}
      </svg>
      <p className='text-center text-xs font-medium text-primary-900'>{label}</p>
    </div>
  );

  return (
    <Card className='p-4'>
      {/* Header avec les noms des villes */}
      <div className='mb-4 flex items-center justify-between border-b pb-4'>
        <span className='text-sm font-medium text-primary'>Ville de Paris</span>
        <span className='text-sm font-medium text-primary'>Dijon Métropole</span>
      </div>

      {/* Section Marchés publics */}
      <div className='mb-4 border-b pb-4'>
        <h4 className='mb-3 text-center text-sm font-semibold text-primary-900'>
          Transparence des marchés publics
        </h4>
        <div className='flex justify-around'>
          {renderScoreTile(data1?.mp_score, isPending1, isError1, 'Transparent')}
          {renderScoreTile(data2?.mp_score, isPending2, isError2, 'Transparent')}
        </div>
      </div>

      {/* Section Subventions */}
      <div>
        <h4 className='mb-3 text-center text-sm font-semibold text-primary-900'>
          Transparence des subventions
        </h4>
        <div className='flex justify-around'>
          {renderScoreTile(data1?.subventions_score, isPending1, isError1, 'Transparent')}
          {renderScoreTile(data2?.subventions_score, isPending2, isError2, 'Très insuffisant')}
        </div>
      </div>
    </Card>
  );
}
