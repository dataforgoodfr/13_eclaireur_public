import {TooltipProps} from '@/utils/types';

export default function TreemapTooltip({visible, x, y, name, value }: TooltipProps) {
  return (
    <div
      className='pointer-events-none fixed z-50 max-w-[200px] rounded bg-gray-900 px-3 py-2 text-sm text-white shadow-lg'
      style={{
        top: y,
        left: x,
        transform: 'translateY(-50%)',
      }}
    >
      <div className='font-bold'>{name}</div>
      <div>{value} €</div>
    </div>
  );
}
