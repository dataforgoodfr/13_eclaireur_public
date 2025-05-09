'use client';

import { SelectCommunityType } from '@/components/Filters/SelectCommunityType';
import { SelectMarchesPublicsScore } from '@/components/Filters/SelectMarchesPublicsScore';
import { SelectPopulation } from '@/components/Filters/SelectPopulation';
import { SelectSubventionsScore } from '@/components/Filters/SelectSubventionsScore';

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
