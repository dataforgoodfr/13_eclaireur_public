'use client';

import { Slider } from '#components/ui/slider';
import { formatNumberInteger } from '#utils/utils';

interface PopulationSliderProps {
  options: number[];
  currentValue: number | null;
  handleSliderChange: (numberList: number[]) => void;
}

export function PopulationSlider({
  options,
  currentValue,
  handleSliderChange,
}: PopulationSliderProps) {
  const maxValue = Math.max(...options);
  const minValue = Math.min(...options);

  return (
    <>
      <p className='mb-3 text-sm font-medium'>Population inférieur à</p>
      <div className='mb-4 px-2'>
        <Slider
          value={[currentValue || maxValue]}
          onValueChange={handleSliderChange}
          min={minValue}
          max={maxValue}
          step={1000}
          className='w-full'
        />
        <div className='mt-1 flex justify-between text-xs text-muted-foreground'>
          <span>{formatNumberInteger(minValue)}</span>
          <span>{formatNumberInteger(maxValue)}</span>
        </div>
      </div>
    </>
  );
}
