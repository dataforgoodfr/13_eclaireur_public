import type { Community } from '#app/models/community';

export default function CommunityBasics({ community }: { community: Community }) {
  const { nom, type, code_postal, nom_departement } = community;
  return (
    <div>
      <h3 className='text-h2'>{nom}</h3>
      <h4 className='text-h4 mt-6'>
        {type} {nom_departement && <>· {nom_departement}</>} {code_postal && <>· {code_postal}</>}
      </h4>
    </div>
  );
}
