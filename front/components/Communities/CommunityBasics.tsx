import { Community } from '#app/models/community';
import { formatFirstLetterToUppercase, stringifyCommunityType } from '#utils/utils';

export default function CommunityBasics({ community }: { community: Community }) {
  const { nom, type, code_postal } = community;
  const communityNameToDisplay = formatFirstLetterToUppercase(nom);
  const communityTypeToDisplay = stringifyCommunityType(type);

  return (
    <div>
      <h3 className='text-h2'>{communityNameToDisplay}</h3>
      <h4 className='text-h4 mt-6'>
        {communityTypeToDisplay} {code_postal ? `· ${code_postal}` : ''}{' '}
      </h4>
    </div>
  );
}
