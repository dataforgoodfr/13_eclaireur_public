'use client';

export interface TransparencyScoreControlsProps {
  selectedScore: string;
  setSelectedScore: (value: string) => void;
}

const options = [
  {
    value: 'mp_score',
    label: 'Transparence Marchés Publics',
  },
  {
    value: 'subventions_score',
    label: 'Transparence Subventions',
  },
  {
    value: 'aggregated_score',
    label: 'Score Agrégé',
  },
];

export default function TransparencyScoreControls({
  selectedScore,
  setSelectedScore,
}: TransparencyScoreControlsProps) {
  return (
    <div className=''>
      <div className='mb-2 mb-4 flex items-center lg:mb-4'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-kanit-bold text-sm font-bold text-white'>
          1
        </span>
        <h4 className='text-base text-sm font-semibold tracking-wide text-primary lg:text-base'>
          Choisissez un score
        </h4>
      </div>
      <div className='flex flex-col gap-2 gap-3 lg:flex-row lg:gap-3'>
        {options.map((opt) => {
          const selected = selectedScore === opt.value;
          return (
            <button
              key={opt.value}
              type='button'
              onClick={() => setSelectedScore(opt.value)}
              className={`rounded-tl-br-lg border border-black px-3 px-4 py-1 py-2 font-kanit-bold text-sm font-medium text-[16x] transition lg:px-4 lg:py-2 lg:text-[16px] ${
                selected ? 'bg-primary text-white' : 'bg-white text-primary'
              } `}
              style={{ minWidth: 'auto' }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
