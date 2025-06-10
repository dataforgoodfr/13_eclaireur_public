import { Community } from '@/app/models/community';
import { stringifyCommunityType } from '@/utils/utils';

type CommunitySuggestionDisplayProps = Pick<Community, 'nom' | 'code_postal' | 'type'>;

export default function Suggestion({ nom, code_postal, type }: CommunitySuggestionDisplayProps) {
  const communityTypeText = stringifyCommunityType(type);
  return (
    <div className='flex w-full justify-between'>
      <span>
        {nom} {code_postal && <span> – {code_postal}</span>}
      </span>
      {communityTypeText && <span> {communityTypeText}</span>}
    </div>
  );
}
