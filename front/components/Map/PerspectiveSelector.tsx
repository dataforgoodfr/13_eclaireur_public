'use client';

import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

interface RangeOption {
  id: string;
  label: string;
  min: number;
  max: number;
  unit: string;
  step: number;
}

const rangeOptions: RangeOption[] = [
  {
    id: 'population',
    label: 'Population de la collectivité',
    min: 0,
    max: 1000000,
    unit: 'habitants',
    step: 1000,
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

export default function PerspectiveSelector() {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [ranges, setRanges] = useState<Record<string, [number, number]>>({
    population: [0, 500000],
    density: [0, 250],
    'total-budget': [0, 5000000],
    'budget-per-capita': [0, 2500],
  });

  const handleRangeChange = (optionId: string, value: [number, number]) => {
    setRanges((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '€' && value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M€`;
    }
    if (unit === 'habitants' && value >= 1000) {
      return `${(value / 1000).toFixed(0)}k ${unit}`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const selectedOptionData = rangeOptions.find((option) => option.id === selectedOption);

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

      <div className='mt-6 space-y-4'>
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className='space-y-4'>
          {rangeOptions.map((option) => (
            <div key={option.id} className='space-y-4'>
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
                      onValueChange={(value) =>
                        handleRangeChange(option.id, value as [number, number])
                      }
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
