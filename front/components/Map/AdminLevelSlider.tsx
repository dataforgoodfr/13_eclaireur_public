'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdminLevelSliderProps {
  selectedLevel: 'regions' | 'departements' | 'communes';
  onLevelChange: (level: 'regions' | 'departements' | 'communes') => void;
  availableLevels: ('regions' | 'departements' | 'communes')[];
}

const levels = [
  { value: 'regions' as const, label: 'Régions', zoom: 5 },
  { value: 'departements' as const, label: 'Départements', zoom: 7 },
  { value: 'communes' as const, label: 'Communes', zoom: 10 },
];

export default function AdminLevelSlider({
  selectedLevel,
  onLevelChange,
  availableLevels,
}: AdminLevelSliderProps) {
  const availableLevelsFiltered = levels.filter((l) => availableLevels.includes(l.value));
  const currentIndexInAvailable = availableLevelsFiltered.findIndex(
    (l) => l.value === selectedLevel,
  );

  return (
    <div className='absolute left-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2'>
      {/* Vertical slider */}
      <div className='flex flex-col items-center rounded-lg border border-gray-300 bg-white/95 p-2 shadow-lg'>
        {/* Up arrow */}
        <button
          type='button'
          onClick={() => {
            if (currentIndexInAvailable > 0) {
              onLevelChange(availableLevelsFiltered[currentIndexInAvailable - 1].value);
            }
          }}
          disabled={currentIndexInAvailable === 0}
          className='rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent'
          aria-label='Niveau supérieur'
        >
          <ChevronUp className='h-5 w-5 text-primary' />
        </button>

        {/* Level indicators */}
        <div className='my-2 flex flex-col gap-3'>
          {levels.map((level) => {
            const isAvailable = availableLevels.includes(level.value);
            return (
              <button
                key={level.value}
                type='button'
                onClick={() => isAvailable && onLevelChange(level.value)}
                disabled={!isAvailable}
                className={`h-3 w-3 rounded-full border-2 transition-all ${
                  !isAvailable
                    ? 'hidden'
                    : selectedLevel === level.value
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 bg-white hover:border-primary/50'
                }`}
                title={level.label}
                aria-label={level.label}
              />
            );
          })}
        </div>

        {/* Down arrow */}
        <button
          type='button'
          onClick={() => {
            if (currentIndexInAvailable < availableLevelsFiltered.length - 1) {
              onLevelChange(availableLevelsFiltered[currentIndexInAvailable + 1].value);
            }
          }}
          disabled={currentIndexInAvailable === availableLevelsFiltered.length - 1}
          className='rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent'
          aria-label='Niveau inférieur'
        >
          <ChevronDown className='h-5 w-5 text-primary' />
        </button>
      </div>
    </div>
  );
}
