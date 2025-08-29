import type { Community } from '#app/models/community';
import { formatNumberInteger } from '#utils/utils';

type CommunityDetailsProps = {
  community: Community;
  compare?: boolean;
  left?: boolean;
};

export function CommunityDetails({ community, compare, left }: CommunityDetailsProps) {
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
          label='Superficie'
          value={formatNumberInteger(community.superficie_ha || 0)}
          unit='hectares'
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
};

function InfoBlock({ label, value, unit, bgColor = 'bg-gray-100' }: InfoBlockProps) {
  return (
    <div className={`rounded-none rounded-br-2xl rounded-tl-2xl p-3 text-primary ${bgColor}`}>
      <div className='flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-start sm:justify-start sm:gap-1'>
        <p className='text-base font-medium'>{label}</p>
        <h4 className='text-lg font-bold'>
          {value}
          {unit && <span className='ml-1 hidden text-base font-normal sm:inline'>{unit}</span>}
        </h4>
      </div>
    </div>
  );
}
