import type { Metadata } from 'next';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'Aide aux élus',
  description:
    'Ma collectivité a une mauvaise note de transparence, pas de panique ! Éclaireur Public vous aide à améliorer la transparence des collectivités',
};
export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Aide aux élus</h1>
      <p className='my-6 text-lg'>Eclaireur Public a élaboré trois barèmes de transparence :</p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>un barème sur la transparence des subventions</li>
        <li className='my-6 text-lg'>un deuxième barème sur la transparence des marchés publics</li>
        <li className='my-6 text-lg'>
          et un troisième barème de transparence global qui est une moyenne des deux barèmes
          ci-dessus
        </li>
      </ul>

      <p className='my-6 text-lg'>
        Ces barèmes mesurent la transparence des données publiques (subventions et marchés publics)
        suivant, pour résumer, le taux de publication de l'ensemble des données attendue sur les
        subventions et sur les marchés publics.
        <br />
        Le détail précis de la notation adopté pour ces barèmes de transparence est consultable sur
        la&nbsp;
        <Link href='/methodologie' className='border-b-2 border-black'>
          page "Comprendre - Méthodologie" dans la section calcul de l'indice de transparence
        </Link>
        .
      </p>
      <h2 className='my-12 text-xl font-bold'>Que dit la loi ?</h2>
      <p className='my-6 text-lg'>
        C'est la loi pour une République Numérique de 2016 qui vise à rendre accessible à tous les
        citoyens les informations essentielles concernant l'action des pouvoirs publics. <br />
        Sont concernées les collectivités suivantes :
      </p>
      <ul className='list-inside list-disc'>
        <li className='my-6 text-lg'>de plus de 3500 habitants</li>
        <li className='my-6 text-lg'>employant plus de 50 personnes en équivalents temps plein</li>
      </ul>
      <h2 className='my-12 text-xl font-bold'>Comment concrètement ouvrir ses données ?</h2>
      <p className='my-6 text-lg'>
        Les données doivent être publiées sur la plateforme gouvernementale prévue à cet effet&nbsp;
        <Link href='https://data.gouv.fr' className='border-b-2 border-black'>
          data.gouv.fr
        </Link>
        .
      </p>
      <p className='my-6 text-lg'>
        Le guide&nbsp;
        <Link
          href='https://www.data.gouv.fr/fr/pages/onboarding/producteurs/'
          className='border-b-2 border-black'
        >
          "Pourquoi et comment ouvrir vos données ?"
        </Link>
        a été mis à disposition par le gouvernement pour faciliter la démarche de publication.
      </p>
      <p>
        Le&nbsp;
        <Link href='https://guides.data.gouv.fr/' className='border-b-2 border-black'>
          minisite guides et documentation data.gouv.fr
        </Link>
        permet d'aller plus loin pour accompagner les collectivités dans leur démarche d'ouverture
        des données.
      </p>
      <p>
        Ainsi, pour les données sur les subventions, les collectivités sont appelées à se conformer
        au schéma défini sur cette &nbsp;
        <Link
          href='https://schema.data.gouv.fr/scdl/subventions/'
          className='border-b-2 border-black'
        >
          page consacrée aux subventions
        </Link>
        .<br />
        Pour les marchés publics, les collectivités sont appelées à se conformer aux &nbsp;
        <Link
          href='https://schema.data.gouv.fr/139bercy/format-commande-publique/'
          className='border-b-2 border-black'
        >
          schémas des données essentielles de la commande publique
        </Link>
        .
      </p>
      <h2 className='my-12 text-xl font-bold'>Questions fréquentes</h2>
      <Accordion type='single' collapsible className='my-6'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Pourquoi ma collectivité a une mauvaise note de transparence ?</AccordionTrigger>
          <AccordionContent>
            {/* TODO - rédiger la réponse */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>Que puis-je faire pour améliorer la transparence de ma collectivité ?</AccordionTrigger>
          <AccordionContent>
            {/* TODO - rédiger la réponse */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>Combien ça coûte d'ouvrir les données au grand public ?</AccordionTrigger>
          <AccordionContent>
            {/* TODO - rédiger la réponse */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-4'>
          <AccordionTrigger>Les données publiées par Eclaireur Public sur ma collectivité sont erronées, comment les
        faire corriger ?</AccordionTrigger>
          <AccordionContent>
            {/* TODO - rédiger la réponse */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
