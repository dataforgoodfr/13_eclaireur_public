'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import SearchBar from '@/components/SearchBar/SearchBar';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const displayTransparencyScore = async (siren: string) => {
    router.push(`/interpeller/${siren}/step1`);
  };

  return (
    <section id='interpellation-step1-nocommunity' className='my-16'>
      <div id='stepper'>
        <img src='placeholder-stepper.png' width='794' height='84' alt='' />
      </div>
      <article className='my-6 flex flex-col justify-start'>
        <h2 className='my-6 text-center text-2xl font-bold'>Trouver une collectivité</h2>
        <div className='ml-16 min-w-[400] self-center'>
          <SearchBar onSelect={({ siren }) => displayTransparencyScore(siren)} />
        </div>
      </article>
      <article className='intro my-16'>
        <h2 className='my-6 text-xl font-bold uppercase'>Pourquoi interpeller mes élu.e.s ?</h2>
        <img
          src='https://placehold.co/200/png'
          width='200'
          height='200'
          alt='*'
          className='float-right'
        />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis officiis at magnam
          recusandae incidunt nobis animi facere, illo harum est?
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus dicta commodi, iste harum
          quisquam fugit placeat inventore tenetur voluptas, nulla alias ab ea dignissimos
          reiciendis nemo incidunt doloremque! Consequatur nemo sequi labore, earum dolorum non.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet quia cumque corrupti,
          tempora nesciunt expedita hic necessitatibus dicta incidunt ad!
        </p>
        <p>
          <Link href='/' className={buttonVariants({ variant: 'outline' })}>
            En savoir plus <ChevronRight />
          </Link>
        </p>
      </article>
    </section>

    //   <section>
    //     <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>Collectivité sélectionnée</h2>
    //     <article className='px-8 py-12 outline'>
    //       <div className='flex justify-between'>
    //         <BadgeCommunity name='exemplaire' />
    //         <BudgetGlobal communityName='Nantes' />
    //       </div>
    //       <div className='mt-10 flex flex-col justify-between md:flex-row'>
    //         <MiniFicheCommunity communitySiren={communityToDisplay} />
    //         <div className='min-w-1/4 md:scale-[0.85]'>
    //           <h3 className='pl-5 font-bold'>Marchés publics</h3>
    //           <TransparencyScoreBar score={scores.marchesPublics} />
    //         </div>
    //         <div className='min-w-1/4 md:scale-[0.85]'>
    //           <h3 className='pl-5 font-bold'>Subventions</h3>
    //           <TransparencyScoreBar score={scores.subventions} />
    //         </div>
    //       </div>
    //       <div className='flex justify-between'>
    //         <RankingCommunity communityName='Nantes' />
    //         <Link className='flex items-end gap-2 hover:underline' href='/'>
    //           Voir la fiche de la collectivité <MoveRight />
    //         </Link>
    //       </div>
    //     </article>
    //   </section>

    // <section id='interpellation-step1' className='my-16'>
    //   <article>
    //     <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>Collectivité sélectionnée</h2>
    //     <img
    //       src='placeholder-collectivite-selectionnee.png'
    //       width='1113'
    //       height='352'
    //       alt=''
    //       className='p-8 outline'
    //     />
    //   </article>
    //   <div className='my-12 flex justify-center gap-4'>
    //     <Link
    //       href='/'
    //       className={buttonVariants({
    //         variant: 'outline',
    //         className: 'min-w-[200] bg-black text-white',
    //       })}
    //     >
    //       <ChevronLeft /> Revenir
    //     </Link>
    //     <Link
    //       href='/'
    //       className={buttonVariants({
    //         variant: 'outline',
    //         className: 'min-w-[200] bg-black text-white',
    //       })}
    //     >
    //       Continuer <ChevronRight />
    //     </Link>
    //   </div>
    // </section>

    // <section id='interpellation-step2' className='my-16'>
    //   <article>
    //     <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>
    //       Choisissez les élu.e.s à interpeller
    //     </h2>
    //     <ul className='flex gap-4'>
    //       <li>
    //         <ElectedPolician
    //           name='toto'
    //           photosrc='https://placehold.co/200/png'
    //           fonction='Maire'
    //           email='johanna.rolland@nantes.com'
    //         />
    //       </li>
    //       <li>
    //         <ElectedPolician
    //           name='toti'
    //           photosrc=''
    //           fonction='Maire'
    //           email='johanna.rolland@nantes.com'
    //         />
    //       </li>
    //       <li>
    //         <ElectedPolician
    //           name='Jackie'
    //           photosrc=''
    //           fonction='Adjointe au maire'
    //           email='jaqueline-d@nantes.com'
    //         />
    //       </li>
    //     </ul>
    //   </article>
    //   <div className='my-12 flex justify-center gap-4'>
    //     <Link
    //       href='/'
    //       className={buttonVariants({
    //         variant: 'outline',
    //         className: 'min-w-[200] bg-black text-white',
    //       })}
    //     >
    //       <ChevronLeft /> Revenir
    //     </Link>
    //     <Link
    //       href='/'
    //       className={buttonVariants({
    //         variant: 'outline',
    //         className: 'min-w-[200] bg-black text-white',
    //       })}
    //     >
    //       Continuer <ChevronRight />
    //     </Link>
    //   </div>
    // </section>

    // <section id='interpellation-step3' className='my-16'>
    //   <article>
    //     <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>Envoyez votre message</h2>
    //     <InterpellateForm to={['olivier.pretre@gmx.fr', 'toto']} missingData='' />
    //   </article>
    // </section>
  );
}
