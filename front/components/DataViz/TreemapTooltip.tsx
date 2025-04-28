import { formatFirstLetterToUppercase, formatPrice } from '@/utils/utils';

import { TooltipProps } from '../../app/community/[siren]/types/interface';

export default function TreemapTooltip({ visible, x, y, name, value }: TooltipProps) {
  return (
    <div
      className='pointer-events-none fixed z-50 max-w-[200px] rounded-lg border border-gray-200 bg-white p-4 px-3 py-2 text-sm font-medium text-gray-900 shadow-lg'
      style={{
        top: y,
        left: x,
        transform: 'translateY(-50%)',
      }}
    >
      <div>{formatFirstLetterToUppercase(name)}</div>
      <div>{formatPrice(value)}</div>
    </div>
  );
}
