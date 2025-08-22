'use client';

import { PopulationSliderFilter } from './PopulationSliderFilter';
import { SelectCommunityType } from './SelectCommunityType';
import { SelectMarchesPublicsScore } from './SelectMarchesPublicsScore';
import { SelectSubventionsScore } from './SelectSubventionsScore';

export function Filters() {
  return (
    <div className='flex items-end gap-4'>
      <SelectCommunityType />
      <PopulationSliderFilter />
      <SelectMarchesPublicsScore />
      <SelectSubventionsScore />
    </div>
  );
}
