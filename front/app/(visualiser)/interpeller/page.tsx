import Image from 'next/image';
import Link from 'next/link';

import ElectedPolician from '@/components/ElectedPoliticians/SinglePoliticianCard';
import InterpellateForm from '@/components/Interpellate/InterpellateForm';
import SearchBar from '@/components/SearchBar/SearchBar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Interpeller</h1>

      <section id='interpellation-step1-nocommunity' className='my-16'>
        <div id='stepper'>
          <img src='placeholder-stepper.png' width='794' height='84' alt='' />
        </div>
        <article className='my-6 flex flex-col justify-start'>
          <h2 className='my-6 text-center text-2xl font-bold'>Trouver une collectivité</h2>
          <div className='ml-16 min-w-[400] self-center'>
            <SearchBar />
          </div>
        </article>
        <article className='intro my-16'>
          <h2 className='my-6 text-xl font-bold uppercase'>Pourquoi interpeller mes élu.e.s ?</h2>
          <img
            src='https://placehold.co/200/png'
            width='200'
            height='200'
            alt='*'
            // className='absolute right-0'
            className='float-right'
          />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis officiis at magnam
            recusandae incidunt nobis animi facere, illo harum est?
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus dicta commodi, iste
            harum quisquam fugit placeat inventore tenetur voluptas, nulla alias ab ea dignissimos
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

      <section id='interpellation-step1' className='my-16'>
        <article>
          <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>Collectivité sélectionnée</h2>
          <img
            src='placeholder-collectivite-selectionnee.png'
            width='1113'
            height='352'
            alt=''
            className='p-8 outline'
          />
        </article>
        <div className='my-12 flex justify-center gap-4'>
          <Link
            href='/'
            className={buttonVariants({
              variant: 'outline',
              className: 'min-w-[200] bg-black text-white',
            })}
          >
            <ChevronLeft /> Revenir
          </Link>
          <Link
            href='/'
            className={buttonVariants({
              variant: 'outline',
              className: 'min-w-[200] bg-black text-white',
            })}
          >
            Continuer <ChevronRight />
          </Link>
        </div>
      </section>

      <section id='interpellation-step2' className='my-16'>
        <article>
          <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>
            Choisissez les élu.e.s à interpeller
          </h2>
          <ul className='flex gap-4'>
            <li>
              <ElectedPolician
                name='toto'
                photosrc='https://placehold.co/200/png'
                fonction='Maire'
                email='johanna.rolland@nantes.com'
              />
            </li>
            <li>
              <ElectedPolician
                name='toti'
                photosrc=''
                fonction='Maire'
                email='johanna.rolland@nantes.com'
              />
            </li>
            <li>
              <ElectedPolician
                name='Jackie'
                photosrc=''
                fonction='Adjointe au maire'
                email='jaqueline-d@nantes.com'
              />
            </li>
          </ul>
        </article>
        <div className='my-12 flex justify-center gap-4'>
          <Link
            href='/'
            className={buttonVariants({
              variant: 'outline',
              className: 'min-w-[200] bg-black text-white',
            })}
          >
            <ChevronLeft /> Revenir
          </Link>
          <Link
            href='/'
            className={buttonVariants({
              variant: 'outline',
              className: 'min-w-[200] bg-black text-white',
            })}
          >
            Continuer <ChevronRight />
          </Link>
        </div>
      </section>

      <section id='interpellation-step3' className='my-16'>
        <article>
          <h2 className='mb-12 mt-6 text-center text-2xl font-bold'>Envoyez votre message</h2>
          <InterpellateForm to={['olivier.pretre@gmx.fr','toto']} missingData='' />
        </article>
      </section>

      <section id='faq' className='my-16'>
        <h2 className='my-6 text-2xl font-bold'>Question fréquentes</h2>
        <Accordion type='single' collapsible className='my-12'>
          <AccordionItem value='item-1'>
            <AccordionTrigger>
              Est-ce que mon identité et mon adresse e-mail seront visibles par les élu·e·s que
              j'interpelle ?
            </AccordionTrigger>
            <AccordionContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
              eveniet impedit sed aspernatur.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>
              Mes données sont-elles conservées par Eclaireur Public ?
            </AccordionTrigger>
            <AccordionContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
              eveniet impedit sed aspernatur.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>
              Comment savoir si mon message a été reçu par mes élu·e·s ?
            </AccordionTrigger>
            <AccordionContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
              eveniet impedit sed aspernatur.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-4'>
            <AccordionTrigger>Que va-t-il se passer suite à mon interpellation ?</AccordionTrigger>
            <AccordionContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
              eveniet impedit sed aspernatur.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <p>
          <Link href='/faq' className={buttonVariants({ variant: 'outline' })}>
            Voir toutes les questions <ChevronRight />
          </Link>
        </p>
      </section>
    </main>
  );
}
