'use client';

import { useEffect, useState } from 'react';

import { PopulationSlider } from '#app/advanced-search/components/Filters/PopulationSlider';
import { useFilterOptions } from '#app/advanced-search/hooks/useFilterOptions';
import { useFiltersParams } from '#app/advanced-search/hooks/useFiltersParams';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { ActionButton } from '#components/ui/action-button';
import { Button } from '#components/ui/button';
import { CommunityType } from '#utils/types';
import { cn, getSortedCommunityTypes, stringifyCommunityType } from '#utils/utils';
import { Award } from 'lucide-react';

interface FilterModalProps {
  closeModal: () => void;
  clearAllFiltersSignal: number;
}

export default function FilterModal({
  closeModal: closeModal,
  clearAllFiltersSignal: clearAllFiltersSignal,
}: FilterModalProps) {
  const {
    filters: {},
    setFilter,
  } = useFiltersParams();
  const { data: filterOptions } = useFilterOptions({});

  const [communityType, SetCommunityType] = useState<string>('');
  const [population, SetPopulation] = useState<number | null>(null);
  const [mp_score, SetMpScore] = useState<string>('');
  const [subventions_score, SetSubventionsScore] = useState<string>('');

  // Whenever clearAllFiltersSignal changes, reset state
  useEffect(() => {
    SetCommunityType('');
    SetPopulation(null);
    SetMpScore('');
    SetSubventionsScore('');
  }, [clearAllFiltersSignal]);

  const allOption: ButtonOption = { id: '', label: 'Tout' };

  const communityOptionList: ButtonOption[] = (
    filterOptions?.types.length
      ? getSortedCommunityTypes(filterOptions.types)
      : getSortedCommunityTypes(Object.values(CommunityType))
  ).map((communityType) => ({
    id: communityType,
    label: stringifyCommunityType(communityType),
  }));
  const typeOptions: ButtonOption[] = [allOption, ...communityOptionList];

  const scoreOptionList: ButtonOption[] = Object.values(TransparencyScore)
    .filter((score) => score !== TransparencyScore.UNKNOWN)
    .sort()
    .map((score) => ({
      id: score,
      label: score,
    }));
  const scoreOptions: ButtonOption[] = [allOption, ...scoreOptionList];

  const populationOptionList = [
    2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000,
  ];

  function handleSliderChange(value: number[]) {
    const newValue = value[0];
    // Find closest predefined option
    const closest = populationOptionList.reduce((prev, curr) =>
      Math.abs(curr - newValue) < Math.abs(prev - newValue) ? curr : prev,
    );
    SetPopulation(closest);
  }

  function applyFilters() {
    setFilter('type', communityType);
    setFilter('mp_score', mp_score);
    setFilter('subventions_score', subventions_score);
    setFilter('population', population?.toString() ?? null);
    closeModal();
  }

  return (
    <div className='space-y-4'>
      <p className='text-muted'>Type</p>
      <FilterButtonGroup
        options={typeOptions}
        value={communityType}
        onChange={SetCommunityType}
        isScore={false}
      />
      <div className='flex justify-between'>
        <span className='text-muted'>Population inférieur à</span>
        <Button
          variant='link'
          size='sm'
          className='ml-auto text-base font-medium text-danger'
          onClick={() => SetPopulation(null)}
        >
          Effacer
        </Button>
      </div>

      <PopulationSlider
        currentValue={population}
        options={populationOptionList}
        handleSliderChange={handleSliderChange}
      />

      <p className='text-muted'>Marchés Publics</p>
      <FilterButtonGroup options={scoreOptions} value={mp_score} onChange={SetMpScore} />

      <p className='text-muted'>Subventions</p>
      <FilterButtonGroup
        options={scoreOptions}
        value={subventions_score}
        onChange={SetSubventionsScore}
      />
      <ActionButton text='Appliquer' className='w-full' onClick={() => applyFilters()} />
    </div>
  );
}

type ButtonOption = {
  id: string;
  label: string;
};

type FilterButtonGroupProps = {
  options: ButtonOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isScore?: boolean;
};

function FilterButtonGroup({
  options,
  value,
  onChange,
  className,
  isScore = true,
}: FilterButtonGroupProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => (
        <button
          key={option.id}
          type='button'
          className={cn(
            'flex items-center rounded-full border border-primary px-4 py-2 font-kanit-bold text-xs',
            value === option.id ? 'bg-primary text-white' : 'bg-white hover:bg-primary/10',
          )}
          onClick={() => onChange(option.id)}
        >
          {/* Pas d'icône pour "Tout" */}
          {isScore && option.id !== '' && <Award className='mr-1 h-4 w-4' />}
          {option.label}
        </button>
      ))}
    </div>
  );
}
