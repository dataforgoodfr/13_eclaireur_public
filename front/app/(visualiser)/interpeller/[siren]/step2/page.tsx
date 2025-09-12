import Image from 'next/image';
import Link from 'next/link';

import CommunityBasics from '#components/Communities/CommunityBasics';
import ContactList from '#components/Contacts/ContactList';
import ButtonBackAndForth from '#components/Interpellate/ButtonBackAndForth';
import Stepper from '#components/Interpellate/Stepper';
import { Button } from '#components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card';
import { fetchCommunities } from '#utils/fetchers/communities/fetchCommunities-server';
import { fetchContacts } from '#utils/fetchers/contacts/fetchContacts-server';
import { ChevronRight } from 'lucide-react';

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
  const formContact = contacts.filter((elt) => elt.type_contact === 'WEB');
  const formContactLen = formContact.length;

  return (
    <>
      <div className='bg-muted-border pb-32'>
        <Stepper currentStep={2} />
      </div>
      <section className='global-margin mb-16 mt-[-7rem]'>
        <article className='mx-4 rounded-3xl border border-primary-light shadow'>
          {emailContactsLen > 0 && (
            <>
              <div
                id='header-article'
                className='align-center flex flex-col justify-between gap-4 rounded-t-3xl bg-[url(/eclaireur/project_background.webp)] bg-cover px-4 py-4 md:flex-row md:gap-0 md:px-8 md:py-12'
              >
                <CommunityBasics community={community} />
                <ButtonBackAndForth
                  linkto={`/interpeller/${siren}/step3`}
                  direction='forth'
                  step={2}
                  className='hidden md:block'
                >
                  Continuer
                </ButtonBackAndForth>
              </div>

              <h3 className='text-h3 mb-6 mt-6 px-4 md:mb-12 md:px-8'>
                Choisir le ou les contacts à interpeller
              </h3>
              {emailContacts && (
                <>
                  <ul className='flex flex-wrap justify-between gap-4 px-4 pb-8 md:px-8'>
                    <ContactList contacts={emailContacts} />
                  </ul>
                  <div className='mb-4 block text-center md:hidden'>
                    <ButtonBackAndForth
                      linkto={`/interpeller/${siren}/step3`}
                      direction='forth'
                      step={2}
                    >
                      Continuer
                    </ButtonBackAndForth>
                  </div>
                </>
              )}
            </>
          )}
          {!emailContactsLen && formContactLen > 0 && (
            <>
              <p className='rounded-t-3xl bg-secondary p-4 text-lg font-bold'>
                <Image
                  src='/eclaireur/error_icon.png'
                  alt='Interpeller'
                  width={24}
                  height={24}
                  className='mr-2 inline-block'
                />
                Nous n’avons pas de contact direct avec les élus pour {communityName}
              </p>
              <div className='bg-white py-16'>
                <Image
                  src='/eclaireur/mascotte_call.svg'
                  alt='Interpeller'
                  width={150}
                  height={129}
                  className='mx-auto block'
                />
                <h3 className='mb-12 mt-6 px-8 text-center'>
                  Vous pouvez toujours agir
                  <br />
                  <span className='text-lg font-normal'>
                    pour faire valoir la transparence des données publiques !
                  </span>
                </h3>

                <ul className='flex flex-wrap justify-between gap-4 px-8 pb-8'>
                  <Card
                    className={`group-[&:nth-of-type(3n+3)]ng-brand-3: min-h-[160] rounded-none rounded-br-xl rounded-tl-xl border-0 bg-primary-light group-[&:nth-of-type(3n+1)]:bg-brand-1 group-[&:nth-of-type(3n+2)]:bg-brand-3`}
                  >
                    <CardHeader className='flex space-y-0 p-0 pl-6 pt-6'>
                      <CardTitle>
                        <h4 className='mt-4 pr-4'>Visiter le site de la collectivité</h4>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href={formContact[0].contact} className='mt-4 flex' target='_blank'>
                        Voir le site de la collectivité
                        <ChevronRight size={14} className='ml-2 self-center' />
                      </Link>
                    </CardContent>
                  </Card>
                </ul>

                <Button
                  size='lg'
                  className='mx-auto mt-8 block rounded-none rounded-br-lg rounded-tl-lg bg-primary hover:bg-primary/90'
                >
                  <Link href='/interpeller' className=''>
                    <Image
                      src='/eclaireur/interpeller.svg'
                      alt='Interpeller'
                      width={20}
                      height={20}
                      className='mr-2 inline-block'
                    />
                    Interpeller une autre collectivité
                  </Link>
                </Button>
              </div>
            </>
          )}
        </article>

        {emailContactsLen > 0 && (
          <>
            <Button
              size='lg'
              className='mx-auto mt-8 block rounded-none rounded-br-lg rounded-tl-lg bg-primary hover:bg-primary/90'
            >
              <Link href='/interpeller' className=''>
                <Image
                  src='/eclaireur/interpeller.svg'
                  alt='Interpeller'
                  width={20}
                  height={20}
                  className='mr-2 inline-block'
                />
                Interpeller une autre collectivité
              </Link>
            </Button>
          </>
        )}
      </section>
    </>
  );
}
