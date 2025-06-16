import { Community } from '@/app/models/community';
import { stringifyCommunityType } from '@/utils/utils';

type CommunitySuggestionDisplayProps = Pick<Community, 'nom' | 'code_postal' | 'type' | 'siren'>;
export default function Suggestion({
  nom,
  code_postal,
  type,
  siren,
}: CommunitySuggestionDisplayProps) {
  const communityTypeText = stringifyCommunityType(type);
  return (
    <div className='flex w-full justify-between'>
      <span>
        {nom} {code_postal && <>– {code_postal}</>}
      </span>
      <span>
        {communityTypeText && <span> {communityTypeText}</span>}
        {siren && <span className='ml-8 text-[12px]'> siren : {siren}</span>}
      </span>
    </div>
  );
}
