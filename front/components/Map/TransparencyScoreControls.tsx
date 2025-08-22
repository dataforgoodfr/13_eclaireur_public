'use client';

export interface TransparencyScoreControlsProps {
  selectedScore: string;
  setSelectedScore: (value: string) => void;
}

const options = [
  {
    value: 'mp_score',
    label: 'Transparence des Marchés Publics',
  },
  {
    value: 'subventions_score',
    label: 'Transparence des Subventions',
  },
];

export default function TransparencyScoreControls({
  selectedScore,
  setSelectedScore,
}: TransparencyScoreControlsProps) {
  return (
    <div className=''>
      <div className='mb-4 lg:mb-4 mb-2 flex items-center'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold font-kanit-bold text-white'>
          1
        </span>
        <h4 className='text-base lg:text-base text-sm font-semibold tracking-wide text-primary'>
          Choisissez un score
        </h4>
      </div>
      <div className='flex gap-3 lg:gap-3 gap-2 flex-col lg:flex-row'>
        {options.map((opt) => {
          const selected = selectedScore === opt.value;
          return (
            <button
              key={opt.value}
              type='button'
              onClick={() => setSelectedScore(opt.value)}
              className={`rounded-tl-br-lg border border-black px-4 py-2 lg:px-4 lg:py-2 px-3 py-1 text-[16x] lg:text-[16px] text-sm font-medium font-kanit-bold transition ${
                selected ? 'bg-[#062aad] text-white' : 'bg-white text-[#062aad]'
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
