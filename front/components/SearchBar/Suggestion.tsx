import type { Community } from '#app/models/community';
import type { CommunityType } from '#utils/types';
import { stringifyCommunityType } from '#utils/utils';

type CommunitySuggestionDisplayProps = Pick<Community, 'nom' | 'code_postal' | 'type'>;
export default function Suggestion({ nom, code_postal, type }: CommunitySuggestionDisplayProps) {
  const communityTypeText = stringifyCommunityType(type as CommunityType);
  const departementNombre = type === 'DEP' ? code_postal : '';
  return (
    <div>
      <>
        {nom} {code_postal && <> - {code_postal}</>}{' '}
        {departementNombre && <> - {departementNombre}</>}
        <> - {communityTypeText}</>
      </>
    </div>
  );
}
