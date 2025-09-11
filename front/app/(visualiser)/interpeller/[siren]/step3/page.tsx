import CommunityBasics from '#components/Communities/CommunityBasics';
import InterpellateForm from '#components/Interpellate/InterpellateForm';
import Stepper from '#components/Interpellate/Stepper';
import { fetchCommunities } from '#utils/fetchers/communities/fetchCommunities-server';

type CommunityPageProps = { params: Promise<{ siren: string }> };

async function getCommunity(siren: string) {
  const communitiesResults = await fetchCommunities({ filters: { siren } });

  if (communitiesResults.length === 0) {
    throw new Error(`Community doesnt exist with siren ${siren}`);
  }
  return communitiesResults[0];
}

export default async function InterpellateStep3({ params }: CommunityPageProps) {
  const { siren } = await params;
  const community = await getCommunity(siren);
  const { type, nom } = community;

  return (
    <>
      <div className='bg-muted-border pb-32'>
        <Stepper currentStep={3} />
      </div>
      <section className='global-margin mb-16 mt-[-7rem]'>
        <article className='mx-4 rounded-3xl border border-primary-light shadow'>
          <div
            id='header-article'
            className='align-center flex flex-col justify-between gap-8 rounded-t-3xl bg-[url(/eclaireur/project_background.webp)] bg-bottom px-8 py-12 md:flex-row md:gap-0'
          >
            <CommunityBasics community={community} />
          </div>

          <InterpellateForm
            missingData=''
            communityParam={siren}
            communityType={type}
            communityName={nom}
          />
        </article>
      </section>
    </>
  );
}
