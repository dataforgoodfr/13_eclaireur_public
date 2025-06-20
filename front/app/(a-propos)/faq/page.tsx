import type { Metadata } from 'next';
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'FAQ - les réponses à toutes vos question',
  description:
    'Un doute ? une interrogation ? Éclaireur Public répond à toutes les questions que vous vous posez (fréquemment)',
};

export default function Page() {
  return (
    <div className='mx-auto w-full max-w-screen-lg p-6'>
      <h1 className='text-3xl font-bold'>Foire Aux Questions - FAQ</h1>
      <Accordion type='single' collapsible className='my-12'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Quel est le rôle d’Éclaireur Public ?</AccordionTrigger>
          <AccordionContent>
            Éclaireur Public est un outil agrégateur des données publiques des collectivités/acteurs
            publics et privés, visant à promouvoir la transparence des finances publiques et
            encourager l'open data.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>Puis-je avoir confiance en Éclaireur Public ?</AccordionTrigger>
          <AccordionContent>
            Éclaireur Public est porté par deux associations reconnues pour leur engagement en
            faveur de la transparence et contre la corruption. Anticor et Transparency
            International.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>
            Ma collectivité ne diffuse aucune information d’intérêt général, comment cela se fait-il
            ?
          </AccordionTrigger>
          <AccordionContent>
            Réponse : Certaines petites communes de moins de 3500 habitants peuvent ne pas être
            obligées de publier des données. Pour les autres collectivités, elles sont légalement
            tenues de le faire, et vous pouvez interpeller votre collectivité via la fonctionnalité
            d’interpellation.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-4'>
          <AccordionTrigger>
            Ma collectivité a publié ses données mais elles n'apparaissent pas sur Éclaireur Public,
            pourquoi ?
          </AccordionTrigger>
          <AccordionContent>
            Il se peut que l'outil n'ait pas pu récupérer les données depuis les plateformes de
            publication des collectivités. Encouragez votre collectivité à publier ses données sur
            data.gouv.fr.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-5'>
          <AccordionTrigger>
            Que puis-je faire si ma collectivité ne publie pas certaines informations publiques
            supposées être obligatoires ?
          </AccordionTrigger>
          <AccordionContent>
            Vous pouvez interpeller votre collectivité via le formulaire de contact d'Éclaireur
            Public pour demander la publication de ces données. En cas de non-réponse après un délai
            de 2 mois, vous pouvez vous adresser à la CADA via MaDada.fr pour effectuer une relance
            officielle ?
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-6'>
          <AccordionTrigger>
            Je souhaiterais communiquer des informations d’intérêt général sur ma collectivité,
            comment dois-je procéder ?
          </AccordionTrigger>
          <AccordionContent>
            Éclaireur Public est un outil de visualisation de données publiques, mais pour
            communiquer de nouvelles informations, vous pouvez vous référer à la documentation
            officielle de data.gouv.fr ou envoyer un message à Éclaireur Publique pour examiner plus
            précisément votre souhait.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-7'>
          <AccordionTrigger>
            Comment interpeller les élus de ma collectivité pour les inciter à communiquer des
            informations supposées être publiques ?
          </AccordionTrigger>
          <AccordionContent>
            Vous pouvez interroger directement les élus via le formulaire d’interpellation ou
            consulter les élections et leur mandat sur la fiche de collectivité.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-8'>
          <AccordionTrigger>
            J’ai déjà alerté un ou des élus, rien ne se passe, quels sont mes recours ?
          </AccordionTrigger>
          <AccordionContent>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde optio maxime blanditiis
            excepturi odio quidem. Cumque eius quisquam quasi officiis inventore obcaecati
            temporibus atque!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-9'>
          <AccordionTrigger>Pourquoi l’Éclaireur Public ?</AccordionTrigger>
          <AccordionContent>
            Éclaireur Public est un projet visant à améliorer la transparence des collectivités
            locales, en rendant accessibles leurs données financières et les informations publiques
            relatives à leur gestion des fonds publics.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-10'>
          <AccordionTrigger>Que voulez-vous dire par collectivités ?</AccordionTrigger>
          <AccordionContent>
            Les collectivités incluent les communes, agglomérations, métropoles, communautés de
            communes, départements, régions, ainsi que les collectivités d'Outre-mer et les
            collectivités à statut particulier.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-11'>
          <AccordionTrigger>Que voulez-vous dire par acteur privé ?</AccordionTrigger>
          <AccordionContent>
            Un acteur privé est une organisation non étatique, susceptible de répondre à des appels
            d'offres publics ou impliquée dans des déclarations d’intérêts publiques.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-12'>
          <AccordionTrigger>Quel est le cadre légal ?</AccordionTrigger>
          <AccordionContent>
            La loi pour une République numérique de 2016 qui vise à rendre plus transparentes les
            politiques publiques est LA référence légale. Certaines dispositions ont évolué et sont
            décrites dans notre page{' '}
            <Link href='/cadre-reglrmentaire' className='border-b-2 border-black'>
              Cadre réglementaire
            </Link>
            .
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-13'>
          <AccordionTrigger>Quelle est la méthodologie ?</AccordionTrigger>
          <AccordionContent>
            Techniquement, Éclaireur Public, c'est la collecte, le raffinement et la rationalisation
            de données. C'est aussi l'élaboration d'un indice de transparence adapté à la
            problématique de données sur les subventions et les marchés publics.
            <br />
            La démarche est décrite de manière transparente sur la page{' '}
            <Link href='/cadre-reglrmentaire' className='border-b-2 border-black'>
              Méthodologie
            </Link>
            .
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-14'>
          <AccordionTrigger>Où puis-je télécharger les données utilisées ?</AccordionTrigger>
          <AccordionContent>
            Les données publiques utilisées par Éclaireur Public peuvent être téléchargées via la
            barre de navigation ou dans le bas de page en cliquant sur le bouton télécharger.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-15'>
          <AccordionTrigger>
            Je suis un élu et souhaiterais avoir un droit de réponse, comment faire ?
          </AccordionTrigger>
          <AccordionContent>
            Éclaireur Public permettra aux élus de répondre aux interpellations des citoyens dans
            une version future. Actuellement, les élus peuvent être contactés via MaDada.fr.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-16'>
          <AccordionTrigger>
            Je suis citoyen et souhaite interpeller ma collectivité, est-ce possible ?
          </AccordionTrigger>
          <AccordionContent>
            Oui, vous pouvez interpeller directement votre collectivité via le formulaire de contact
            disponible sur les fiches des collectivités, afin de demander la publication des données
            manquantes.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-17'>
          <AccordionTrigger>Qui puis-je contacter pour des informations ?</AccordionTrigger>
          <AccordionContent>
            Pour toute question, vous pouvez contacter Anticor ou Transparency International. Un
            formulaire de contact sera également disponible sur la page
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-18'>
          <AccordionTrigger>
            Ma collectivité ne diffuse aucune information d’intérêt général, comment cela se fait-il
            ?
          </AccordionTrigger>
          <AccordionContent>
            {/* TODO - rédiger la réponse */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A incidunt voluptatum
            recusandae officia earum itaque inventore minima, cupiditate delectus, accusantium ex
            iusto exercitationem ullam et!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-19'>
          <AccordionTrigger>
            Ma collectivité a publié ses données mais elles n'apparaissent pas sur Eclaireur public,
            pourquoi ?
          </AccordionTrigger>
          <AccordionContent>
            {/* TODO - rédiger la réponse */}
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint quisquam rerum odit
            placeat dolorum eos consectetur animi harum quibusdam corrupti, quam, dignissimos
            tenetur eaque numquam.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
