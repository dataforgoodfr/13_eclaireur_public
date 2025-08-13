import type { Community } from '#app/models/community';
import { formatNumberInteger } from '#utils/utils';

type CommunityDetailsProps = {
  community: Community;
};

export function CommunityDetails({ community }: CommunityDetailsProps) {
  return (
    <>

      {/* Info blocks */}
      <div className='flex flex-col gap-4 w-full'>
        <InfoBlock
          label='Population'
          value={formatNumberInteger(community.population)}
          unit='habitants'
          bgColor='bg-yellow-100'
        />
        <InfoBlock
          label='Superficie'
          value={formatNumberInteger(community.superficie_ha || 0)}
          unit='hectares'
          bgColor='bg-lime-100'
        />
        <InfoBlock
          label="Nombre d'agents administratifs"
          value={formatNumberInteger(community.tranche_effectif)}
          unit='agents'
          bgColor='bg-indigo-100'
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
      <div className='flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:gap-1'>
        <p className='text-base font-medium'>{label}</p>
        <h4 className='text-lg font-bold'>
          {value}
          {unit && <span className='hidden sm:inline ml-1 text-base font-normal'>{unit}</span>}
        </h4>
      </div>
    </div>
  );
}

