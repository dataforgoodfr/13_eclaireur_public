import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

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
        <div>
          <p>
            Les données doivent être publiées sur la plateforme gouvernementale prévue à cet effet{' '}
            <Link
              href='https://data.gouv.fr'
              target='_blank'
              className='font-medium hover:underline'
            >
              data.gouv.fr
            </Link>
          </p>
          <p>
            Le guide {' '}
            <Link
              href='https://www.data.gouv.fr/pages/onboarding/producteurs/'
              target='_blank'
              className='font-medium hover:underline'
            >
              "Pourquoi et comment ouvrir vos données&nbsp;?"
            </Link>
            a été mis à disposition par le gouvernement pour faciliter la démarche de publication.
          </p>
          <p>
            Le mini site{' '}
            <Link
              href='https://guides.data.gouv.fr/'
              target='_blank'
              className='font-medium hover:underline'
            >
              guides et documentation data.gouv.fr
            </Link>{' '}
            permet d'aller plus loin pour accompagner les collectivités dans leur démarche
            d'ouverture des données.
          </p>
          <p>
            Ainsi, pour les données sur les subventions, les collectivités sont appelées à se
            conformer au schéma défini sur cette{' '}
            <Link
              href='https://schema.data.gouv.fr/scdl/subventions/'
              target='_blank'
              className='font-medium hover:underline'
            >
              page consacrée aux subventions
            </Link>
            .
          </p>
          <p>
            Pour les marchés publics, les collectivités sont appelées à se conformer aux{' '}
            <Link
              href='https://schema.data.gouv.fr/139bercy/format-commande-publique/'
              target='_blank'
              className='font-medium hover:underline'
            >
              schémas des données essentielles de la commande publique
            </Link>
            .
          </p>
        </div>
      </article>
      <div className='mx-auto mb-20 w-full p-4 md:p-8 xl:max-w-[1128px] xl:p-0'>
        <div className='hidden grid-cols-2 md:grid'>
          <div className='mt-2.5 space-y-4'>
            <h1 className='text-3xl font-bold'>Questions fréquentes</h1>
            <div className='w-[350px] text-xl font-semibold md:block lg:w-[500px]'>
              Consultez les réponses aux questions les plus courantes sur l'utilisation d'Éclaireur
              Public
            </div>
            <Image
              src={'/eclaireur/mascotte-faq.svg'}
              alt='Image de la mascotte se posant des questions'
              width={256}
              height={128}
            />
          </div>
          <div>
            <Accordion type='multiple'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>
                  Pourquoi ma collectivité a une mauvaise note de transparence&nbsp;?
                </AccordionTrigger>
                <AccordionContent>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae, hic quaerat
                  culpa sint sapiente, veritatis minima nam veniam quasi eius maiores velit soluta
                  possimus sit deserunt ut dicta dolores dolore iste totam doloremque corrupti.
                  Doloremque beatae ducimus, perspiciatis quas id animi reprehenderit minus
                  asperiores dolor consequuntur, facilis incidunt omnis obcaecati.{' '}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <AccordionTrigger>
                  Que puis-je faire pour améliorer la transparence de ma collectivité&nbsp;?
                </AccordionTrigger>
                <AccordionContent>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam accusantium
                  illum amet magnam, expedita in autem incidunt deserunt, dolor laborum aperiam odit
                  repellat rem facilis aspernatur totam! Eaque illo eum cumque ipsum nemo recusandae
                  assumenda.{' '}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-3'>
                <AccordionTrigger>
                  Combien ça coûte d'ouvrir les données au grand public&nbsp;?
                </AccordionTrigger>
                <AccordionContent>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint impedit doloremque
                  laudantium vel iure quos corrupti, quaerat voluptatem aliquid aut quod rerum
                  commodi voluptate amet dignissimos qui autem sunt! Accusantium esse nisi
                  praesentium delectus totam voluptatem distinctio laboriosam cumque modi!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-4'>
                <AccordionTrigger>
                  Les données publiées par Eclaireur Public sur ma collectivité sont erronées,
                  comment les faire corriger&nbsp;?
                </AccordionTrigger>
                <AccordionContent>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed dolorem eius quo
                  cumque voluptatem. Voluptas labore ex ducimus eius veritatis quae? Consectetur
                  enim dicta nam ipsum. Fugiat molestiae assumenda explicabo.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className='md:hidden'>
          <h1 className='mb-4 text-3xl font-bold'>Questions fréquentes</h1>
          <Accordion type='single' collapsible>
            <AccordionItem value='item-1'>
              <AccordionTrigger>
                Pourquoi ma collectivité a une mauvaise note de transparence&nbsp;?
              </AccordionTrigger>
              <AccordionContent>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Recusandae, hic quaerat
                culpa sint sapiente, veritatis minima nam veniam quasi eius maiores velit soluta
                possimus sit deserunt ut dicta dolores dolore iste totam doloremque corrupti.
                Doloremque beatae ducimus, perspiciatis quas id animi reprehenderit minus asperiores
                dolor consequuntur, facilis incidunt omnis obcaecati.{' '}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
              <AccordionTrigger>
                Que puis-je faire pour améliorer la transparence de ma collectivité&nbsp;?
              </AccordionTrigger>
              <AccordionContent>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quisquam accusantium illum
                amet magnam, expedita in autem incidunt deserunt, dolor laborum aperiam odit
                repellat rem facilis aspernatur totam! Eaque illo eum cumque ipsum nemo recusandae
                assumenda.{' '}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>
                Combien ça coûte d'ouvrir les données au grand public&nbsp;?
              </AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint impedit doloremque
                laudantium vel iure quos corrupti, quaerat voluptatem aliquid aut quod rerum commodi
                voluptate amet dignissimos qui autem sunt! Accusantium esse nisi praesentium
                delectus totam voluptatem distinctio laboriosam cumque modi!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-4'>
              <AccordionTrigger>
                Les données publiées par Eclaireur Public sur ma collectivité sont erronées, comment
                les faire corriger&nbsp;?
              </AccordionTrigger>
              <AccordionContent>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed dolorem eius quo
                cumque voluptatem. Voluptas labore ex ducimus eius veritatis quae? Consectetur enim
                dicta nam ipsum. Fugiat molestiae assumenda explicabo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </main>
  );
}
