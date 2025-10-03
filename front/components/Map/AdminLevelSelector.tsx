'use client';

import { Slider } from '#components/ui/slider';

export type AdminLevel = 'regions' | 'departements' | 'communes';

interface AdminLevelSelectorProps {
  selectedLevel: AdminLevel;
  onSelectLevel: (level: AdminLevel) => void;
}

const ADMIN_LEVELS: { value: AdminLevel; label: string; sliderValue: number }[] = [
  { value: 'regions', label: 'Régions', sliderValue: 0 },
  { value: 'departements', label: 'Départements', sliderValue: 1 },
  { value: 'communes', label: 'Communes', sliderValue: 2 },
];

export default function AdminLevelSelector({
  selectedLevel,
  onSelectLevel,
}: AdminLevelSelectorProps) {
  const currentSliderValue =
    ADMIN_LEVELS.find((level) => level.value === selectedLevel)?.sliderValue ?? 0;

  const handleSliderChange = (value: number[]) => {
    const level = ADMIN_LEVELS.find((l) => l.sliderValue === value[0]);
    if (level) {
      onSelectLevel(level.value);
    }
  };

  return (
    <div className='mb-4 mb-8 lg:mb-8'>
      <div className='mb-2 mb-4 flex items-center lg:mb-4'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-kanit-bold text-sm font-bold text-white'>
          5
        </span>
        <h4 className='text-sm text-primary lg:text-base'>Niveau d'affichage</h4>
      </div>

      <div className='space-y-4'>
        {/* Slider */}
        <div className='px-2'>
          <Slider
            value={[currentSliderValue]}
            onValueChange={handleSliderChange}
            min={0}
            max={2}
            step={1}
            className='w-full'
          />
        </div>

        {/* Labels */}
        <div className='flex justify-between px-2 font-kanit-bold text-sm text-primary'>
          {ADMIN_LEVELS.map((level) => (
            <button
              key={level.value}
              type='button'
              onClick={() => onSelectLevel(level.value)}
              className={`transition-colors ${
                selectedLevel === level.value ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
