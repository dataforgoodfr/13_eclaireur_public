'use client';

export type AdminLevel = 'regions' | 'departements' | 'communes';

interface AdminLevelControlProps {
  selectedLevel: AdminLevel;
  onSelectLevel: (level: AdminLevel) => void;
}

const levels: { value: AdminLevel; label: string }[] = [
  { value: 'regions', label: 'Régions' },
  { value: 'departements', label: 'Départements' },
  { value: 'communes', label: 'Communes' },
];

export default function AdminLevelControl({
  selectedLevel,
  onSelectLevel,
}: AdminLevelControlProps) {
  return (
    <div className='mb-4 mb-8 lg:mb-8'>
      <div className='mb-2 mb-4 flex items-center lg:mb-4'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-kanit-bold text-sm font-bold text-white'>
          5
        </span>
        <h4 className='text-sm text-primary lg:text-base'>Niveau d'affichage</h4>
      </div>

      {/* Three buttons for level selection */}
      <div className='flex flex-col gap-2'>
        {levels.map((level) => (
          <button
            key={level.value}
            type='button'
            onClick={() => onSelectLevel(level.value)}
            className={`rounded-tl-br-lg border border-black px-4 py-2 font-kanit-bold text-sm transition ${
              selectedLevel === level.value ? 'bg-[#062aad] text-white' : 'bg-white text-[#062aad]'
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
