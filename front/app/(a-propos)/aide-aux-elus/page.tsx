import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { SectionHeader } from '#app/components/SectionHeader';
import type { FaqItem } from '#components/FaqWithSchema';
import { FaqWithSchema } from '#components/FaqWithSchema';

export const metadata: Metadata = {
  title: 'Aide aux élus',
  description:
    'Ma collectivité a une mauvaise note de transparence, pas de panique ! Éclaireur Public vous aide à améliorer la transparence des collectivités',
};

const faqItems: FaqItem[] = [
  {
    id: 'item-1',
    question: 'Pourquoi ma collectivité a une mauvaise note de transparence\u00A0?',
    answer: (
      <>
        Une mauvaise note de transparence signifie que votre collectivité ne publie pas l'ensemble
        des données obligatoires sur les subventions et/ou les marchés publics ou que ces données
        sont incomplètes. Cela peut être dû à l'absence de publication sur{' '}
        <Link href='https://data.gouv.fr' target='_blank' className='font-medium hover:underline'>
          data.gouv.fr
        </Link>
        , à des données non conformes aux schémas requis ou à un manque de mise à jour régulière.
        Consultez votre fiche collectivité sur Éclaireur Public pour identifier précisément les
        données manquantes.
      </>
    ),
  },
  {
    id: 'item-2',
    question: 'Que puis-je faire pour améliorer la transparence de ma collectivité\u00A0?',
    answer: (
      <>
        Pour améliorer votre note de transparence vous devez publier l'ensemble de vos données sur
        les subventions et marchés publics sur{' '}
        <Link href='https://data.gouv.fr' target='_blank' className='font-medium hover:underline'>
          data.gouv.fr
        </Link>{' '}
        en respectant les schémas officiels. Utilisez les guides disponibles sur{' '}
        <Link href='https://data.gouv.fr' target='_blank' className='font-medium hover:underline'>
          data.gouv.fr
        </Link>{' '}
        pour vous accompagner dans cette démarche. Assurez-vous également de mettre à jour
        régulièrement vos données et de vérifier leur conformité. Éclaireur Public vous indiquera
        ensuite les améliorations constatées lors de la prochaine mise à jour. Vous pourrez ensuite
        voir l'évolution de votre note lors de la prochaine mise à jour.
      </>
    ),
  },
  {
    id: 'item-3',
    question: "Combien ça coûte d'ouvrir les données au grand public\u00A0?",
    answer: (
      <>
        L'ouverture des données publiques représente un coût modéré essentiellement lié au temps de
        travail des agents pour préparer et publier les données. La plateforme{' '}
        <Link href='https://data.gouv.fr' target='_blank' className='font-medium hover:underline'>
          data.gouv.fr
        </Link>{' '}
        est gratuite. De nombreuses collectivités utilisent leurs logiciels de gestion existants
        (comptabilité marchés publics) qui peuvent souvent exporter automatiquement les données aux
        formats requis. Le coût initial de mise en conformité est rapidement amorti par la
        simplification des démarches ultérieures.
      </>
    ),
  },
  {
    id: 'item-4',
    question:
      'Les données publiées par Eclaireur Public sur ma collectivité sont erronées, comment les faire corriger\u00A0?',
    answer: (
      <>
        Éclaireur Public collecte et affiche les données publiées par les collectivités sur les
        plateformes open data officielles. Si vous constatez des erreurs cela signifie que les
        données sources doivent être corrigées sur{' '}
        <Link href='https://data.gouv.fr' target='_blank' className='font-medium hover:underline'>
          data.gouv.fr
        </Link>{' '}
        ou sur votre plateforme de publication. Une fois vos données corrigées à la source,
        Éclaireur Public les récupérera automatiquement lors de la prochaine mise à jour. Pour toute
        question vous pouvez contacter l'équipe via le formulaire de contact du site.
      </>
    ),
  },
];

export default function Page() {
  return (
    <main>
      <SectionHeader sectionTitle='Aide aux élus' />
      <article className='section-format space-y-8'>
        <h2>Eclaireur Public a élaboré trois barèmes de transparence</h2>
        <div>
          <p className='mb-2'>Eclaireur Public a élaboré trois barèmes de transparence :</p>
          <ul className='mb-4 list-disc pl-5'>
            <li>Un premier sur la transparence des subventions</li>
            <li>Un deuxième sur la transparence des marchés publics</li>
            <li>Un troisième, global, qui agrège les deux barèmes ci-dessus.</li>
          </ul>
          <p>
            Ces barèmes mesurent la qualité de la publication de ces deux types de données
            publiques, en comparant l'état de publication par rapport aux éléments obligatoires
            (figurant dans des décrets organisant la publication en open data).
          </p>
          <p>
            Le détail précis de la notation adoptée pour ces barèmes de transparence est consultable
            sur la page &quot;Comprendre - Méthodologie&quot; dans la section &quot;Calcul de
            l'indice de transparence&quot;.
          </p>
        </div>
        <h2>Que dit la loi ?</h2>
        <div>
          <p>
            La loi rend obligatoire la publication en ligne, dans un format ouvert (open data), des
            principaux documents et données des collectivités territoriales. Sont concernées les
            données d'intérêt économique, social, sanitaire et environnemental.
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
            Les données sont publiées sur la plateforme gouvernementale prévue à cet effet{' '}
            <Link
              href='https://data.gouv.fr'
              target='_blank'
              className='font-medium hover:underline'
            >
              data.gouv.fr
            </Link>
          </p>
          <p>
            Le guide{' '}
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
            <FaqWithSchema items={faqItems} type='multiple' pageTitle='Aide aux élus' />
          </div>
        </div>

        <div className='md:hidden'>
          <h1 className='mb-4 text-3xl font-bold'>Questions fréquentes</h1>
          <FaqWithSchema items={faqItems} type='single' collapsible pageTitle='Aide aux élus' />
        </div>
      </div>
    </main>
  );
}
