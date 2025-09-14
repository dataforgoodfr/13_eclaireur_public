import type { Metadata } from 'next';

import { SectionHeader } from '#app/components/SectionHeader';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#components/ui/accordion';

export const metadata: Metadata = {
  title: 'Aide aux élus',
  description:
    'Ma collectivité a une mauvaise note de transparence, pas de panique ! Éclaireur Public vous aide à améliorer la transparence des collectivités',
};
export default function Page() {
  return (
    <main>
      <SectionHeader sectionTitle='Aide aux élus' />
      <article className='section-format space-y-8'>
        <h2>Eclaireur Public a élaboré trois barèmes de transparence</h2>
        <div>
          <p className='mb-2'>Eclaireur Public a élaboré trois barèmes de transparence :</p>
          <ul className='mb-4 list-disc pl-5'>
            <li>un barème sur la transparence des subventions</li>
            <li>un deuxième barème sur la transparence des marchés publics</li>
            <li>
              un troisième barème de transparence global qui est une moyenne des deux barèmes
              ci-dessus
            </li>
          </ul>
          <p>
            Ces barèmes mesurent la transparence des données publiques (subventions et marchés
            publics) suivant, pour résumer, le taux de publication de l'ensemble des données
            attendue sur les subventions et sur les marchés publics.
          </p>
          <p>
            Le détail précis de la notation adopté pour ces barèmes de transparence est consultable
            sur la page "Comprendre - Méthodologie" dans la section calcul de l'indice de
            transparence.
          </p>
        </div>
        <h2>Que dit la loi ?</h2>
        <div>
          <p>
            C'est la loi pour une République Numérique de 2016 qui vise à rendre accessible à tous
            les citoyens les informations essentielles concernant l'action des pouvoirs
            publics.{' '}
          </p>
          <p>Sont concernées les collectivités suivantes :</p>
          <ul className='mb-4 list-disc pl-5'>
            <li>de plus de 3500 habitants,</li>
            <li>employant plus de 50 personnes en équivalents temps plein.</li>
          </ul>
        </div>
        <h2>Comment concrètement ouvrir ses données ?</h2>
      </article>
      <h2 className='my-12 text-xl font-bold'>Questions fréquentes</h2>
      <Accordion type='single' collapsible className='my-6'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>
            Pourquoi ma collectivité a une mauvaise note de transparence ?
          </AccordionTrigger>
          <AccordionContent>
            {/* TODO - rédiger la réponse */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>
            Que puis-je faire pour améliorer la transparence de ma collectivité ?
          </AccordionTrigger>
          <AccordionContent>
            {/* TODO - rédiger la réponse */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>
            Combien ça coûte d'ouvrir les données au grand public ?
          </AccordionTrigger>
          <AccordionContent>
            {/* TODO - rédiger la réponse */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae assumenda perferendis
            eveniet impedit sed aspernatur.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-4'>
          <AccordionTrigger>
            Les données publiées par Eclaireur Public sur ma collectivité sont erronées, comment les
            faire corriger ?
          </AccordionTrigger>
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
