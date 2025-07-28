'use client';

import { PlusCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '#components/ui/button';
import { Label } from '#components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#components/ui/popover';
import { Separator } from '#components/ui/separator';
import { Slider } from '#components/ui/slider';
import { formatNumberInteger } from '#utils/utils';

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
    type,
    mp_score,
    subventions_score,
  });

  const options = filterOptions?.populations.length
    ? filterOptions.populations
    : fallbackOptions;

  const currentValue = population ?? null;
  const maxValue = Math.max(...options);
  const minValue = Math.min(...options);

  function handleSliderChange(value: number[]) {
    const newValue = value[0];
    // Find closest predefined option
    const closest = options.reduce((prev, curr) =>
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev
    );
    setFilter('population', closest.toString());
  }

  function handlePresetClick(value: number) {
    setFilter('population', value.toString());
    setOpen(false);
  }

  function handleClear() {
    setFilter('population', null);
  }

  return (
    <div className='flex flex-col'>
      <Label className='mb-2'>Population inférieur à</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="border-dashed w-[180px] justify-start">
            {currentValue !== null ? (
              <div
                role="button"
                aria-label="Clear population filter"
                tabIndex={0}
                className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
              >
                <XCircle className="h-3 w-3" />
              </div>
            ) : (
              <PlusCircle className="h-3 w-3 mr-2" />
            )}
            <span className="truncate">
              {currentValue !== null ? formatNumberInteger(currentValue) : 'Choisissez un nombre'}
            </span>
            {currentValue !== null && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-2 h-4"
                />
                <span className="text-xs text-muted-foreground">hab.</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-4">
          <div className="space-y-4">
            <div>
              <p className="font-medium text-sm mb-3">Population inférieur à</p>

              {/* Slider */}
              <div className="px-2 mb-4">
                <Slider
                  value={[currentValue || maxValue]}
                  onValueChange={handleSliderChange}
                  min={minValue}
                  max={maxValue}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatNumberInteger(minValue)}</span>
                  <span>{formatNumberInteger(maxValue)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="w-full"
            >
              Effacer
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}