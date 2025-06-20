'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

import type { AdminType } from './types';
import { formatValue } from './utils/perspectiveFunctions';

interface CollectiviteMinMax {
  type: string;
  min_population: number;
  max_population: number;
}

interface RangeOption {
  id: string;
  label: string;
  min: number;
  max: number;
  unit: string;
  step: number;
}

interface PerspectiveSelectorProps {
  minMaxValues: CollectiviteMinMax[];
  currentAdminLevel: AdminType;
  selectedOption: string;
  onSelectedOptionChange: (option: string) => void;
  ranges: Record<string, [number, number]>;
  onRangeChange: (optionId: string, value: [number, number]) => void;
}

export default function PerspectiveSelector({
  minMaxValues,
  currentAdminLevel,
  selectedOption,
  onSelectedOptionChange,
  ranges,
  onRangeChange,
}: PerspectiveSelectorProps) {
  const getMinMaxForAdminLevel = () => {
    const data = minMaxValues.find((item) => item.type === currentAdminLevel);
    return {
      min: data?.min_population || 0,
      max: data?.max_population || 1000000,
    };
  };

  const populationMinMax = getMinMaxForAdminLevel();

  const rangeOptions: RangeOption[] = [
    {
      id: 'population',
      label: 'Population de la collectivité',
      min: populationMinMax.min,
      max: populationMinMax.max,
      unit: 'habitants',
      step: Math.max(1000, Math.floor((populationMinMax.max - populationMinMax.min) / 100)),
    },
    {
      id: 'density',
      label: 'Densité de population',
      min: 0,
      max: 500,
      unit: 'hab/km²',
      step: 5,
    },
    {
      id: 'total-budget',
      label: 'Montant du budget total',
      min: 0,
      max: 10000000,
      unit: '€',
      step: 10000,
    },
    {
      id: 'budget-per-capita',
      label: 'Budget par habitant',
      min: 0,
      max: 5000,
      unit: '€',
      step: 50,
    },
  ];

  return (
    <div className='mb-8'>
      <div className='mb-4 flex items-center'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#062aad] text-sm font-bold text-white'>
          3
        </span>
        <span className='text-base font-semibold tracking-wide text-[#062aad]'>
          METTEZ EN PERSPECTIVE
        </span>
      </div>

      <div className='space-y-4'>
        <RadioGroup
          value={selectedOption}
          onValueChange={onSelectedOptionChange}
          className='space-y-4'
        >
          {rangeOptions.map((option) => (
            <div key={option.id} className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className='border-[#062aad] text-[#062aad]'
                />
                <Label htmlFor={option.id} className='cursor-pointer font-medium text-[#062aad]'>
                  {option.label}
                </Label>
              </div>
              {selectedOption === option.id && (
                <div className='space-y-3 rounded-lg p-4'>
                  <div className='flex justify-between text-sm text-gray-600'>
                    <span>{formatValue(ranges[option.id][0], option.unit)}</span>
                    <span>{formatValue(ranges[option.id][1], option.unit)}</span>
                  </div>

                  <div className='px-2'>
                    <Slider
                      value={ranges[option.id]}
                      onValueChange={(value) => onRangeChange(option.id, value as [number, number])}
                      min={option.min}
                      max={option.max}
                      step={option.step}
                      className='w-full'
                    />
                  </div>

                  <div className='flex justify-between text-xs text-gray-500'>
                    <span>Min</span>
                    <span>Max</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
