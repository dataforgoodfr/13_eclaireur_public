// TODO: Review and remove unused variables. This file ignores unused vars for now.
/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatAmount, formatFirstLetterToUppercase, formatPrice } from '@/utils/utils';

import { TooltipProps } from '../../app/community/[siren]/types/interface';

export default function TreemapTooltip({ visible, x, y, name, value, percentage }: TooltipProps) {
  return (
    <div
      className='pointer-events-none fixed z-50 max-w-[200px] rounded-lg border border-gray-200 bg-white p-4 px-3 py-2 text-sm font-medium text-gray-900 shadow-lg'
      style={{
        top: y,
        left: x,
        transform: 'translateY(-50%)',
      }}
    >
      <div className='mb-2 flex flex-wrap items-center justify-between'>
        <div className='mr-3'>{formatPrice(value)}</div>
        <div className='font-normal'>({formatAmount(percentage * 100)}%)</div>
      </div>
      <hr />
      <div className='font-normal'>{formatFirstLetterToUppercase(name)}</div>
    </div>
  );
}
