import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import type { FaqItem } from '#components/FaqWithSchema';
import { FaqWithSchema } from '#components/FaqWithSchema';

export const metadata: Metadata = {
  title: 'FAQ - les réponses à toutes vos question',
  description:
    'Un doute&nbsp;? une interrogation&nbsp;? Éclaireur Public répond à toutes les questions que vous vous posez (fréquemment)',
};

const faqItems: FaqItem[] = [
  {
    id: 'item-1',
    question: "Quel est le rôle d'Éclaireur Public\u00A0?",
    answer:
      "Éclaireur Public est un outil agrégateur des données publiques des collectivités/acteurs publics et privés, visant à promouvoir la transparence des finances publiques et encourager l'open data.",
  },
  {
    id: 'item-2',
    question: 'Puis-je avoir confiance en Éclaireur Public\u00A0?',
    answer:
      'Éclaireur Public est porté par deux associations reconnues pour leur engagement en faveur de la transparence et contre la corruption. Anticor et Transparency International.',
  },
  {
    id: 'item-3',
    question:
      "Ma collectivité ne diffuse aucune information d'intérêt général, comment cela se fait-il\u00A0?",
    answer:
      "Certaines petites communes de moins de 3500 habitants peuvent ne pas être obligées de publier des données. Pour les autres collectivités, elles sont légalement tenues de le faire, et vous pouvez interpeller votre collectivité via la fonctionnalité d'interpellation.",
  },
  {
    id: 'item-4',
    question:
      "Ma collectivité a publié ses données mais elles n'apparaissent pas sur Éclaireur Public, pourquoi\u00A0?",
    answer:
      "Il se peut que l'outil n'ait pas pu récupérer les données depuis les plateformes de publication des collectivités. Encouragez votre collectivité à publier ses données sur data.gouv.fr.",
  },
  {
    id: 'item-5',
    question:
      'Que puis-je faire si ma collectivité ne publie pas certaines informations publiques supposées être obligatoires\u00A0?',
    answer:
      "Vous pouvez interpeller votre collectivité via le formulaire de contact d'Éclaireur Public pour demander la publication de ces données. En cas de non-réponse après un délai de 2 mois, vous pouvez vous adresser à la CADA via MaDada.fr pour effectuer une relance officielle\u00A0?",
  },
  {
    id: 'item-6',
    question:
      "Je souhaiterais communiquer des informations d'intérêt général sur ma collectivité, comment dois-je procéder\u00A0?",
    answer:
      'Éclaireur Public est un outil de visualisation de données publiques, mais pour communiquer de nouvelles informations, vous pouvez vous référer à la documentation officielle de data.gouv.fr ou envoyer un message à Éclaireur Publique pour examiner plus précisément votre souhait.',
  },
  {
    id: 'item-7',
    question:
      'Comment interpeller les élus de ma collectivité pour les inciter à communiquer des informations supposées être publiques\u00A0?',
    answer:
      "Vous pouvez interroger directement les élus via le formulaire d'interpellation ou consulter les élections et leur mandat sur la fiche de collectivité.",
  },
  {
    id: 'item-8',
    question: "J'ai déjà alerté un ou des élus, rien ne se passe, quels sont mes recours\u00A0?",
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde optio maxime blanditiis excepturi odio quidem. Cumque eius quisquam quasi officiis inventore obcaecati temporibus atque!',
  },
  {
    id: 'item-9',
    question: "Pourquoi l'Éclaireur Public\u00A0?",
    answer:
      'Éclaireur Public est un projet visant à améliorer la transparence des collectivités locales, en rendant accessibles leurs données financières et les informations publiques relatives à leur gestion des fonds publics.',
  },
  {
    id: 'item-10',
    question: 'Que voulez-vous dire par collectivités\u00A0?',
    answer:
      "Les collectivités incluent les communes, agglomérations, métropoles, communautés de communes, départements, régions, ainsi que les collectivités d'Outre-mer et les collectivités à statut particulier.",
  },
  {
    id: 'item-11',
    question: 'Que voulez-vous dire par acteur privé\u00A0?',
    answer:
      "Un acteur privé est une organisation non étatique, susceptible de répondre à des appels d'offres publics ou impliquée dans des déclarations d'intérêts publiques.",
  },
  {
    id: 'item-12',
    question: 'Quel est le cadre légal\u00A0?',
    answer: (
      <>
        La loi pour une République numérique de 2016 qui vise à rendre plus transparentes les
        politiques publiques est LA référence légale. Certaines dispositions ont évolué et sont
        décrites dans notre page{' '}
        <Link href='/cadre-reglrmentaire' className='border-b-2 border-black'>
          Cadre réglementaire
        </Link>
        .
      </>
    ),
  },
  {
    id: 'item-13',
    question: 'Quelle est la méthodologie\u00A0?',
    answer: (
      <>
        Techniquement, Éclaireur Public, c'est la collecte, le raffinement et la rationalisation de
        données. C'est aussi l'élaboration d'un indice de transparence adapté à la problématique de
        données sur les subventions et sur les marchés publics.
        <br />
        La démarche est décrite de manière transparente sur la page{' '}
        <Link href='/cadre-reglrmentaire' className='border-b-2 border-black'>
          Méthodologie
        </Link>
        .
      </>
    ),
  },
  {
    id: 'item-14',
    question: 'Où puis-je télécharger les données utilisées\u00A0?',
    answer:
      'Les données publiques utilisées par Éclaireur Public peuvent être téléchargées via la barre de navigation ou dans le bas de page en cliquant sur le bouton télécharger.',
  },
  {
    id: 'item-15',
    question: 'Je suis un élu et souhaiterais avoir un droit de réponse, comment faire\u00A0?',
    answer:
      'Éclaireur Public permettra aux élus de répondre aux interpellations des citoyens dans une version future. Actuellement, les élus peuvent être contactés via MaDada.fr.',
  },
  {
    id: 'item-16',
    question: 'Je suis citoyen et souhaite interpeller ma collectivité, est-ce possible\u00A0?',
    answer:
      'Oui, vous pouvez interpeller directement votre collectivité via le formulaire de contact disponible sur les fiches des collectivités, afin de demander la publication des données manquantes.',
  },
  {
    id: 'item-17',
    question: 'Qui puis-je contacter pour des informations\u00A0?',
    answer:
      'Pour toute question, vous pouvez contacter Anticor ou Transparency International. Un formulaire de contact sera également disponible sur la page',
  },
  {
    id: 'item-18',
    question:
      "Ma collectivité ne diffuse aucune information d'intérêt général, comment cela se fait-il\u00A0?",
    answer:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. A incidunt voluptatum recusandae officia earum itaque inventore minima, cupiditate delectus, accusantium ex iusto exercitationem ullam et!',
  },
  {
    id: 'item-19',
    question:
      "Ma collectivité a publié ses données mais elles n'apparaissent pas sur Eclaireur public, pourquoi\u00A0?",
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint quisquam rerum odit placeat dolorum eos consectetur animi harum quibusdam corrupti, quam, dignissimos tenetur eaque numquam.',
  },
];

export default function Page() {
  return (
    <div className='mx-auto mb-20 mt-2 w-full max-w-screen-lg p-6 md:mt-20'>
      <div className='mb-4 flex items-center justify-between md:mb-12'>
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold'>Foire Aux Questions - FAQ</h1>
          <div className='hidden w-[500px] text-xl font-semibold md:block'>
            Consultez les réponses aux questions les plus courantes sur l'utilisation d'Éclaireur
            Public
          </div>
        </div>
        <Image
          src={'/eclaireur/mascotte-faq.svg'}
          alt='Image de la mascotte se posant des questions'
          width={160}
          height={128}
          className='hidden md:flex'
        />
      </div>
      <div className='hidden md:flex'>
        <FaqWithSchema items={faqItems} type='multiple' pageTitle='Foire Aux Questions - FAQ' />
      </div>

      <div className='flex md:hidden'>
        <FaqWithSchema
          items={faqItems}
          type='single'
          collapsible
          pageTitle='Foire Aux Questions - FAQ'
        />
      </div>
    </div>
  );
}
