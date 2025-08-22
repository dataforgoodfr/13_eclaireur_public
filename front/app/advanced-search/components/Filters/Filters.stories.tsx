import { useEffect } from 'react';

import { formatNumberInteger, stringifyCommunityType } from '@/utils/utils';
import type { Meta, StoryObj } from '@storybook/react';

import { useFiltersParams } from '../../hooks/useFiltersParams';
import { Filters } from './Filters';
import { PopulationSliderFilter } from './PopulationSliderFilter';
import { SelectCommunityType } from './SelectCommunityType';
import { SelectMarchesPublicsScore } from './SelectMarchesPublicsScore';
import { SelectSubventionsScore } from './SelectSubventionsScore';

const meta: Meta = {
  title: 'Advanced Search/Filters',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

// Composant pour afficher les valeurs sélectionnées
const FilterResultDisplay = ({
  filterType,
}: {
  filterType: 'all' | 'type' | 'population' | 'mp_score' | 'subventions_score';
}) => {
  const { filters } = useFiltersParams();

  const getDisplayValue = () => {
    switch (filterType) {
      case 'type':
        return filters.type ? stringifyCommunityType(filters.type) : 'Aucune sélection';
      case 'population':
        return filters.population
          ? `< ${formatNumberInteger(filters.population)} habitants`
          : 'Aucune sélection';
      case 'mp_score':
        return filters.mp_score ? `Score: ${filters.mp_score}` : 'Aucune sélection';
      case 'subventions_score':
        return filters.subventions_score
          ? `Score: ${filters.subventions_score}`
          : 'Aucune sélection';
      case 'all':
        const selections = [];
        if (filters.type) selections.push(`Type: ${stringifyCommunityType(filters.type)}`);
        if (filters.population)
          selections.push(`Population: < ${formatNumberInteger(filters.population)}`);
        if (filters.mp_score) selections.push(`Marchés Publics: ${filters.mp_score}`);
        if (filters.subventions_score) selections.push(`Subventions: ${filters.subventions_score}`);
        return selections.length > 0 ? selections.join(' | ') : 'Aucune sélection';
      default:
        return 'Aucune sélection';
    }
  };

  return (
    <div className='mt-4 rounded-md border bg-gray-50 p-3'>
      <div className='mb-1 text-sm font-medium text-gray-700'>Valeur sélectionnée :</div>
      <div className='font-mono text-sm text-gray-900'>{getDisplayValue()}</div>
    </div>
  );
};

export const TousLesFiltres: Story = {
  render: () => (
    <div className='p-4'>
      <h3 className='mb-4 text-lg font-semibold'>Tous les Filtres</h3>
      <div className='flex items-end gap-4'>
        <Filters />
      </div>
      <div className='mt-2 text-sm text-muted-foreground'>
        * Cliquez sur chaque filtre pour voir les options disponibles
      </div>
      <FilterResultDisplay filterType='all' />
    </div>
  ),
};

export const TypeDeCollectivite: Story = {
  render: () => {
    const AutoOpenSelect = () => {
      useEffect(() => {
        // Force open the select after a short delay
        const timer = setTimeout(() => {
          const trigger = document.querySelector('[role="combobox"]') as HTMLElement;
          if (trigger) {
            trigger.click();
          }
        }, 100);
        return () => clearTimeout(timer);
      }, []);

      return <SelectCommunityType />;
    };

    return (
      <div className='p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Filtre Type de Collectivité (Ouvert)</h3>
        <div className='flex items-end gap-4'>
          <AutoOpenSelect />
        </div>
        <div className='mt-2 text-sm text-muted-foreground'>
          * Ce filtre est automatiquement ouvert pour la démonstration
        </div>
        <FilterResultDisplay filterType='type' />
      </div>
    );
  },
};

export const Population: Story = {
  render: () => {
    const AutoOpenPopover = () => {
      useEffect(() => {
        // Force open the popover after a short delay
        const timer = setTimeout(() => {
          const trigger = document.querySelector(
            '[role="button"]:has([data-testid*="plus"]), button:has(.lucide-plus-circle)',
          ) as HTMLElement;
          if (trigger) {
            trigger.click();
          }
        }, 100);
        return () => clearTimeout(timer);
      }, []);

      return <PopulationSliderFilter />;
    };

    return (
      <div className='p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Filtre Population (Ouvert)</h3>
        <div className='flex items-end gap-4'>
          <AutoOpenPopover />
        </div>
        <div className='mt-2 text-sm text-muted-foreground'>
          * Ce filtre est automatiquement ouvert pour la démonstration
        </div>
        <FilterResultDisplay filterType='population' />
      </div>
    );
  },
};

export const ScoreMarchesPublics: Story = {
  render: () => {
    const AutoOpenSelect = () => {
      useEffect(() => {
        // Force open the select after a short delay
        const timer = setTimeout(() => {
          const triggers = document.querySelectorAll('[role="combobox"]');
          const trigger = Array.from(triggers).find(
            (el) =>
              el.textContent?.includes('Marchés') ||
              el.closest('div')?.textContent?.includes('Marchés'),
          ) as HTMLElement;
          if (trigger) {
            trigger.click();
          }
        }, 100);
        return () => clearTimeout(timer);
      }, []);

      return <SelectMarchesPublicsScore />;
    };

    return (
      <div className='p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Filtre Score Marchés Publics (Ouvert)</h3>
        <div className='flex items-end gap-4'>
          <AutoOpenSelect />
        </div>
        <div className='mt-2 text-sm text-muted-foreground'>
          * Ce filtre est automatiquement ouvert pour la démonstration
        </div>
        <FilterResultDisplay filterType='mp_score' />
      </div>
    );
  },
};

export const ScoreSubventions: Story = {
  render: () => {
    const AutoOpenSelect = () => {
      useEffect(() => {
        // Force open the select after a short delay
        const timer = setTimeout(() => {
          const triggers = document.querySelectorAll('[role="combobox"]');
          const trigger = Array.from(triggers).find(
            (el) =>
              el.textContent?.includes('Subventions') ||
              el.closest('div')?.textContent?.includes('Subventions'),
          ) as HTMLElement;
          if (trigger) {
            trigger.click();
          }
        }, 100);
        return () => clearTimeout(timer);
      }, []);

      return <SelectSubventionsScore />;
    };

    return (
      <div className='p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Filtre Score Subventions (Ouvert)</h3>
        <div className='flex items-end gap-4'>
          <AutoOpenSelect />
        </div>
        <div className='mt-2 text-sm text-muted-foreground'>
          * Ce filtre est automatiquement ouvert pour la démonstration
        </div>
        <FilterResultDisplay filterType='subventions_score' />
      </div>
    );
  },
};
