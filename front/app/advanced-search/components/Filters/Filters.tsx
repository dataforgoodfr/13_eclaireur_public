'use client';

import { SelectCommunityType } from './SelectCommunityType';
import { SelectMarchesPublicsScore } from './SelectMarchesPublicsScore';
import { SelectPopulation } from './SelectPopulation';
import { SelectSubventionsScore } from './SelectSubventionsScore';

export function Filters() {
  return (
    <div className='flex gap-4'>
      <SelectCommunityType />
      <SelectPopulation />
      <SelectMarchesPublicsScore />
      <SelectSubventionsScore />
    </div>
  );
}
