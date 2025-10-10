'use client';

import { useState } from 'react';

import { PopulationSlider } from '#app/advanced-search/components/Filters/PopulationSlider';
import { Button } from '#components/ui/button';
import { Label } from '#components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '#components/ui/popover';
import { Separator } from '#components/ui/separator';
import type { CommunityType } from '#utils/types';
import { formatNumberInteger } from '#utils/utils';
import { PlusCircle, XCircle } from 'lucide-react';

import { useFilterOptions } from '../../hooks/useFilterOptions';
import { useFiltersParams } from '../../hooks/useFiltersParams';

const fallbackOptions = [2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 2_000_000];

export function PopulationSliderFilter() {
  const [open, setOpen] = useState(false);

  const {
    filters: { population, type, mp_score, subventions_score },
    setFilter,
  } = useFiltersParams();

  const { data: filterOptions } = useFilterOptions({
    type: type as CommunityType | undefined,
    mp_score,
    subventions_score,
  });

  const options = filterOptions?.populations.length ? filterOptions.populations : fallbackOptions;
  const currentValue = population ?? null;

  function handleSliderChange(value: number[]) {
    const newValue = value[0];
    // Find closest predefined option
    const closest = options.reduce((prev, curr) =>
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev,
    );
    setFilter('population', closest.toString());
  }

  function handleClear() {
    setFilter('population', null);
  }

  return (
    <div className='flex flex-col'>
      <Label className='mb-2'>Population inférieure à</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm' className='w-[180px] justify-start border-dashed'>
            {currentValue !== null ? (
              <div
                role='button'
                aria-label='Clear population filter'
                tabIndex={0}
                className='mr-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <XCircle className='h-3 w-3' />
              </div>
            ) : (
              <PlusCircle className='mr-2 h-3 w-3' />
            )}
            <span className='truncate'>
              {currentValue !== null ? formatNumberInteger(currentValue) : 'Choisissez un nombre'}
            </span>
            {currentValue !== null && (
              <>
                <Separator orientation='vertical' className='mx-2 h-4' />
                <span className='text-xs text-muted-foreground'>hab.</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-80 p-4'>
          <div className='space-y-4'>
            {/* Slider */}
            <p className='mb-3 text-sm font-medium'>Population inférieure à</p>

            <PopulationSlider
              currentValue={currentValue}
              handleSliderChange={handleSliderChange}
              options={options}
            />
            <Separator />
            <Button variant='outline' size='sm' onClick={handleClear} className='w-full'>
              Effacer
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
