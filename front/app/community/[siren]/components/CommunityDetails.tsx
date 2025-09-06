import type { Community } from '#app/models/community';
import { SlidingNumber } from '#components/animate-ui/text/sliding-number';
import { formatNumberInteger } from '#utils/utils';

type CommunityDetailsProps = {
  community: Community;
  compare?: boolean;
  left?: boolean;
  budgetTotal?: number | null;
};

export function CommunityDetails({ community, compare, left, budgetTotal }: CommunityDetailsProps) {
  const budgetEnMillions =
    typeof budgetTotal === 'number' ? Math.round(budgetTotal / 1_000_000) : null;
  return (
    <>
      {/* Info blocks */}
      <div className='flex w-full flex-col gap-4'>
        <InfoBlock
          label='Population'
          value={formatNumberInteger(community.population)}
          unit='habitants'
          bgColor={compare ? (left ? 'bg-brand-3' : 'bg-primary-light') : 'bg-yellow-100'}
        />
        <InfoBlock
          label='Budget total'
          value={budgetEnMillions !== null ? formatNumberInteger(budgetEnMillions) : '—'}
          unit='M€'
          bgColor={compare ? (left ? 'bg-brand-3' : 'bg-primary-light') : 'bg-lime-100'}
        />
        <InfoBlock
          label="Nombre d'agents administratifs"
          value={formatNumberInteger(community.tranche_effectif)}
          unit='agents'
          bgColor={compare ? (left ? 'bg-brand-3' : 'bg-primary-light') : 'bg-indigo-100'}
        />
      </div>
    </>
  );
}

type InfoBlockProps = {
  label: string;
  value: string;
  unit?: string;
  bgColor?: string;
  showRealValue?: boolean;
};

function InfoBlock({
  label,
  value,
  unit,
  bgColor = 'bg-gray-100',
  showRealValue = true,
}: InfoBlockProps) {
  // Extract the numeric value from the formatted string
  const numericValue = Number.parseInt(value.replace(/\s/g, ''), 10) || 0;

  return (
    <div className={`rounded-none rounded-br-2xl rounded-tl-2xl p-3 text-primary ${bgColor}`}>
      <div className='flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-start sm:justify-start sm:gap-1'>
        <p className='text-base font-medium'>{label}</p>
        <h4 className='text-lg font-bold'>
          <SlidingNumber
            number={showRealValue ? numericValue : 0}
            inView={showRealValue}
            inViewOnce={true}
            inViewMargin='-50px'
            className='tabular-nums'
            transition={{
              stiffness: 150,
              damping: 20,
              mass: 0.4,
            }}
          />
          {unit && <span className='ml-1 hidden text-base font-normal sm:inline'>{unit}</span>}
        </h4>
      </div>
    </div>
  );
}
