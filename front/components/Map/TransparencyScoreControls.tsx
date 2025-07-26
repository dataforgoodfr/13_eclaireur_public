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
      <div className='mb-4 flex items-center'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#062aad] text-sm font-bold text-white'>
          1
        </span>
        <span className='text-base font-semibold tracking-wide text-[#062aad]'>
          CHOISISSEZ UN SCORE
        </span>
      </div>
      <div className='flex gap-3'>
        {options.map((opt) => {
          const selected = selectedScore === opt.value;
          return (
            <button
              key={opt.value}
              type='button'
              onClick={() => setSelectedScore(opt.value)}
              className={`rounded border border-black px-4 py-2 text-sm font-medium transition ${
                selected ? 'bg-[#062aad] text-white' : 'bg-white text-[#062aad]'
              } `}
              style={{ minWidth: 180 }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
