import ContactList from '@/components/Contacts/ContactList';
import ButtonBackAndForth from '@/components/Interpellate/ButtonBackAndForth';
import Stepper from '@/components/Interpellate/Stepper';
import { fetchCommunities } from '@/utils/fetchers/communities/fetchCommunities-server';
import { fetchContacts } from '@/utils/fetchers/contacts/fetchContacts-server';

async function getContacts(siren: string) {
  return await fetchContacts({ filters: { siren } });
}
async function getCommunity(siren: string) {
  const communitiesResults = await fetchCommunities({ filters: { siren } });
  if (communitiesResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }

  return communitiesResults[0];
}

type InterpellateStep2Props = {
  params: Promise<{ siren: string }>;
};

export default async function InterpellateStep2({ params }: InterpellateStep2Props) {
  const { siren } = await params;
  const community = await getCommunity(siren);
  const communityName = community.nom;

  const contacts = await getContacts(siren);
  const emailContacts = contacts.filter((elt) => elt.type_contact === 'MAIL');
  const emailContactsLen = emailContacts.length;
  // const formContact = contacts.filter((elt) => elt.type_contact === 'WEB');

  return (
    <section id='interpellation-step2' className='my-16'>
      <article>
        <Stepper currentStep={2} />
        {emailContactsLen > 0 && (
          <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>
            {communityName} <br />
            Choisissez le ou les contacts ou élu.e.s à interpeller
          </h2>
        )}
        {!emailContactsLen && (
          <h3 className='mb-12 mt-6 text-center text-xl font-bold'>
            Oops ! Nous n’avons pas de contact direct ou générique avec la collectivité
            sélectionnée.
            <br />
            <span className='font-normal'>
              Cependant, vous pouvez toujours agir pour faire valoir la transparence des données
              publiques !
            </span>
          </h3>
        )}
        {emailContacts && (
          <ul className='flex flex-wrap gap-4'>
            <ContactList contacts={emailContacts} />
          </ul>
        )}
      </article>
      <div className='my-12 flex justify-center gap-4'>
        <ButtonBackAndForth linkto={`/interpeller/${siren}/step1`} direction='back'>
          Revenir
        </ButtonBackAndForth>
        <ButtonBackAndForth linkto={`/interpeller/${siren}/step3`} direction='forth'>
          Continuer
        </ButtonBackAndForth>
      </div>
    </section>
  );
}
