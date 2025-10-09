'use client';

export interface TransparencyScoreControlsProps {
  selectedScore: string;
  setSelectedScore: (value: string) => void;
}

const options = [
  {
    value: 'mp_score',
    label: 'Marchés Publics',
  },
  {
    value: 'subventions_score',
    label: 'Subventions',
  },
  {
    value: 'aggregated_score',
    label: 'Agrégé',
  },
];

export default function TransparencyScoreControls({
  selectedScore,
  setSelectedScore,
}: TransparencyScoreControlsProps) {
  return (
    <div className=''>
      <h4 className='mb-4 text-sm font-semibold tracking-wide text-primary lg:text-base'>
        Choisissez un score
      </h4>
      <div className='mb-4 flex items-center'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-kanit-bold text-sm font-bold text-white'>
          1
        </span>
        <h4 className='text-sm font-semibold tracking-wide text-primary lg:text-base'>
          ... de transparence des
        </h4>
      </div>
      <div className='flex flex-col gap-1'>
        {/* First row: Marchés Publics and Subventions */}
        <div className='flex-col-2 flex flex-col justify-center lg:flex-row lg:gap-4'>
          {options.slice(0, 2).map((opt) => {
            const selected = selectedScore === opt.value;
            return (
              <button
                key={opt.value}
                type='button'
                onClick={() => setSelectedScore(opt.value)}
                className={`flex-1 rounded-tl-br-lg border-2 px-4 py-2 font-kanit-bold text-sm font-medium transition-all duration-200 ease-in-out lg:text-base ${
                  selected
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-300 bg-white text-primary hover:border-primary hover:shadow-sm'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {/* Second row: Score Agrégé centered */}
        <div className='flex flex-col items-center gap-0.5'>
          <span className='text-sm font-semibold text-primary lg:text-base'>ou</span>
          <div className='flex w-full justify-center px-8 lg:px-16'>
            {(() => {
              const opt = options[2];
              const selected = selectedScore === opt.value;
              return (
                <button
                  key={opt.value}
                  type='button'
                  onClick={() => setSelectedScore(opt.value)}
                  className={`w-full rounded-tl-br-lg border-2 px-4 py-2 font-kanit-bold text-sm font-medium transition-all duration-200 ease-in-out lg:text-base ${
                    selected
                      ? 'border-primary bg-primary text-white shadow-md'
                      : 'border-gray-300 bg-white text-primary hover:border-primary hover:shadow-sm'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
