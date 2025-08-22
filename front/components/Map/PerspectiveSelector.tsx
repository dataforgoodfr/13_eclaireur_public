'use client';

import { Slider } from '#components/ui/slider';
import { cn } from '#utils/utils';
import type { AdminType } from './types';
import { formatValue } from './utils/perspectiveFunctions';
import { Check } from 'lucide-react';

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
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold font-kanit-bold text-white'>
          3
        </span>
        <h4 className='text-primary'>
          METTEZ EN PERSPECTIVE
        </h4>
      </div>

      <div className='space-y-4'>
        <ButtonGroup
          options={rangeOptions.map(option => ({
            label: option.label,
            value: option.id,
          }))}
          value={selectedOption}
          onChange={onSelectedOptionChange}
          className="mb-4"
        />
        {rangeOptions.map((option) =>
          selectedOption === option.id ? (
            <div key={option.id} className='space-y-3 rounded-lg p-4'>
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
          ) : null
        )}
      </div>
    </div>
  );
}


interface ButtonGroupProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
function ButtonGroup({ options, value, onChange, className }: ButtonGroupProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            'flex items-center px-4 py-2 rounded-full border border-primary text-primary font-kanit-bold transition-colors',
            value === option.value
              ? 'bg-primary text-white'
              : 'bg-white hover:bg-primary/10'
          )}
          onClick={() => onChange(option.value)}
        >
          {value === option.value && (
            <Check className="mr-2 h-6 w-6 " />
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
}