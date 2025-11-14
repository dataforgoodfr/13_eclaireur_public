import type { Community } from '#app/models/community';

export default function CommunityBasics({ community }: { community: Community }) {
  const { nom, formattedType, code_postal, nom_departement } = community;
  return (
    <div>
      <h3 className='text-h2'>{nom}</h3>
      <h4 className='text-h4 mt-4'>
        {formattedType} {nom_departement && <>· {nom_departement}</>} {code_postal && <>· {code_postal}</>}
      </h4>
    </div>
  );
}
