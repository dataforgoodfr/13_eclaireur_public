'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  SCORE_TO_RANGE,
  SCORE_TRANSPARENCY_COLOR,
  TransparencyScore,
} from '#components/TransparencyScore/constants';
import { CRITERIA, SCORES } from '@/utils/constants';
import { ChevronRight } from 'lucide-react';

const grades = [
  TransparencyScore.A,
  TransparencyScore.B,
  TransparencyScore.C,
  TransparencyScore.D,
  TransparencyScore.E,
];

export default function OurMethodologyExtended() {
  const [selectedScore, setSelectedScore] = useState<keyof typeof SCORES>('A');

  return (
    <article className='global-margin px-4 pb-2 md:pb-20'>
      <div className='flex flex-col gap-6 lg:rounded-xl lg:border lg:border-primary-light lg:p-6'>
        <h2 className='text-h2 hidden md:mb-5 md:block'>Notre méthodologie de transparence</h2>
        <h2 className='text-h2 block md:hidden'>Notre méthodologie</h2>
        <div className='grid gap-4'>
          <div>
            <div className='grid gap-4'>
              <p className='text-lg'>
                L'indice de transparence des <strong>marchés publics</strong> repose sur trois
                facteurs clés :
              </p>
            </div>
            <div className='mt-6 flex flex-col gap-4'>
              <MethodologyCard
                picto='/eclaireur/one.png'
                title='Publication de données sur les marchés inférieurs à 40 000 €'
                colorClassName='bg-brand-1'
              />
              <MethodologyCard
                picto='/eclaireur/two.png'
                title='Publication de données sur les marchés supérieurs à 40 000 €'
                colorClassName='bg-brand-2'
              />
              <MethodologyCard
                picto='/eclaireur/three.png'
                title='Publication de données sur les 10 critères suivants :'
                colorClassName='bg-brand-3'
                criteria={CRITERIA}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-6 md:flex-row md:gap-16'>
          <div className='flex w-[200] min-w-[200px] items-center justify-center'>
            <Image
              src={SCORES[selectedScore].picto}
              alt={SCORES[selectedScore].title}
              className='aspect-square w-full max-w-[200px] object-contain'
              width={200}
              height={200}
            />
          </div>

          <div className='flex flex-col gap-8'>
            {/* Score selector */}
            <div className='grid w-full grid-cols-5 items-center border-b border-primary-light'>
              {Object.keys(SCORES).map((score) => (
                <div key={score} className='col-span-1 w-full justify-self-center'>
                  <button
                    key={score}
                    onClick={() => setSelectedScore(score as keyof typeof SCORES)}
                    className={`w-full py-4 text-2xl font-bold transition-all duration-200 ${
                      selectedScore === score
                        ? 'border-b-4 border-primary text-primary'
                        : 'text-primary-light hover:border-b-4 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {score}
                  </button>
                </div>
              ))}
            </div>

            {/* Score display */}

            <div className='flex w-full flex-col gap-4'>
              <h3 className='text-2xl font-bold text-primary'>{SCORES[selectedScore].title}</h3>
              <p className='text-lg leading-relaxed'>{SCORES[selectedScore].description}</p>
            </div>
          </div>
        </div>
        <div className='mx-auto mb-4 mt-4 h-px w-full max-w-[253px] bg-primary-light md:max-w-[629px]'></div>
        <div className='text-lg'>
          <div>
            L'indice de transparence des <strong>subventions</strong>, pour une année N, d'une
            collectivité se calcule comme suit&nbsp;:
          </div>
          <div className='gap-16 py-6 md:flex'>
            <div>
              <div>
                La somme des subventions détaillées divisée par la somme totale des subventions
                indiquée dans le budget du compte administratif.
              </div>
              <div className='mt-6'>
                Une grille établit les notes de transparence, de A à E, en fonction du taux de
                publication.
              </div>
              <div className='mt-6'>
                La valeur A étant la note maximale avec un taux de publication de 100 % (+/- 5%), et
                la valeur E correspondant à 0% de publications (aucune donnée exploitable).
              </div>
            </div>
            <div className='mt-6 flex flex-col gap-2 md:mt-0 md:min-w-[468px]'>
              {grades.map((score) => {
                return (
                  <div key={score} className='flex flex-row items-center justify-between'>
                    <div
                      className={`flex h-[60px] w-[80px] items-center justify-center rounded-tl-br-xl md:w-[113px] ${SCORE_TRANSPARENCY_COLOR[score as TransparencyScore]}`}
                      title={score}
                    >
                      <span className={`font-kanit-bold text-[24px] font-bold leading-[24px]`}>
                        {score}
                      </span>
                    </div>
                    <div className='flex-1 px-4 text-center text-lg font-bold md:px-16'>
                      {SCORE_TO_RANGE[score as TransparencyScore]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
          <Link
            href={'/methodologie'}
            className='my-10 flex w-full items-center justify-center rounded-br-xl rounded-tl-xl border bg-primary p-2 text-white md:my-0 md:mt-10 md:w-80'
          >
            <span className='me-2 font-bold'>Découvrir notre méthodologie</span>
            <ChevronRight />
          </Link>
        </div>
      </div>
    </article>
  );
}

function MethodologyCard({
  picto,
  title,
  colorClassName,
  criteria,
}: {
  picto: string;
  title: string;
  colorClassName?: string;
  criteria?: string[];
}) {
  return (
    <div
      className={`box-border flex h-full w-full flex-col justify-between gap-4 rounded-br-xl rounded-tl-xl p-4 ${colorClassName}`}
    >
      <div className='flex flex-row items-center gap-4'>
        <Image src={picto} alt={title} className='h-8 w-8' width={32} height={32} />
        <h4 className='text-h4'>{title}</h4>
      </div>
      {criteria && (
        <div className='flex flex-wrap gap-2'>
          {criteria.map((criterion) => (
            <div key={criterion}>
              <div className='flex flex-row gap-2'>
                <div className='rounded-full bg-white px-4 py-2 font-bold'>{criterion}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
