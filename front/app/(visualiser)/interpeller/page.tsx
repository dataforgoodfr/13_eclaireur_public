'use client';

import { useRouter } from 'next/navigation';

import FrequentlyAskedQuestions from '#app/components/FrequentlyAskedQuestions';
import OurMethodologyExtended from '#app/components/OurMethodologyExtended';
import WhyChallenge from '#app/components/WhyChallenge';
import Stepper from '#components/Interpellate/Stepper';
import SearchBar from '#components/SearchBar/SearchBar';

export default function Page() {
  const router = useRouter();
  const goToStep1 = async (siren: string) => {
    router.push(`/interpeller/${siren}/step1`);
  };

  return (
    <>
      <div className='bg-muted-border pb-32'>
        <Stepper currentStep={1} />
      </div>
      <section
        id='interpellation-step1-nocommunity'
        className='global-margin mb-4 mt-[-7rem] md:mb-16'
      >
        <article className='mt-6 flex flex-col justify-start bg-[url(/eclaireur/project_background.webp)] md:py-6'>
          <h2 className='text-h1 my-6 text-center font-bold'>
            Trouver une collectivité <br />
            <div className='inline-block bg-gradient-fade px-8'>à interpeller</div>
          </h2>
          <p className='mx-auto my-4 px-1 text-center text-xl md:w-1/2 md:text-[1.375rem]'>
            Accédez aux données de dépenses <br className='block md:hidden' />
            publiques <br className='hidden md:block' />
            de votre commune, <br className='block md:hidden' /> département ou région.
          </p>
          <div className='mx-auto mb-4 w-4/5 min-w-[400px] justify-center md:w-[473px]'>
            <SearchBar className='block' onSelect={({ siren }) => goToStep1(siren)} />
          </div>
        </article>

        <WhyChallenge />
        <OurMethodologyExtended />
        <FrequentlyAskedQuestions />
      </section>
    </>
  );
}
