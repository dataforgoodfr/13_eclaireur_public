import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import {
  ResponsiveAccordion,
  ResponsiveAccordionContent,
  ResponsiveAccordionItem,
  ResponsiveAccordionTrigger,
} from '#components/ui/responsive-accordion';

export const metadata: Metadata = {
  title: 'FAQ - les réponses à toutes vos question',
  description:
    'Un doute ? une interrogation ? Éclaireur Public répond à toutes les questions que vous vous posez (fréquemment)',
};

export default function Page() {
  return (
    <div className='mx-auto w-full max-w-screen-lg p-6'>
      {/* Header section with mascot */}
      <div className='mb-12 text-center'>
        <h1 className='mb-6 text-4xl font-bold text-primary'>Foire Aux Questions - FAQ</h1>
        <p className='mb-8 text-lg text-muted-foreground'>
          Un doute ? Une interrogation ? Éclaireur Public répond à toutes les questions que vous vous posez.
        </p>
        
        {/* Mascot placeholder - replace with actual mascot when available */}
        <div className='mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10'>
          <span className='text-4xl'>🔍</span>
        </div>
      </div>

      {/* FAQ Responsive Accordion */}
      <ResponsiveAccordion type='multiple' collapsible mobileExclusive={true} className='space-y-4'>
        {/* Interpellation questions - as specified in the requirements */}
        <ResponsiveAccordionItem value='interpellation-1' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Puis-je interpeller les élu·e·s de manière anonyme ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Non, l'interpellation doit être nominative afin de garantir sa légitimité. En revanche, vos coordonnées ne sont utilisées que pour transmettre votre message et ne sont pas exploitées à d'autres fins.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='interpellation-2' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Mes données sont-elles conservées par Éclaireur Public ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Non. Éclaireur Public ne conserve pas le contenu de vos interpellations ni vos coordonnées personnelles. Vos informations sont uniquement utilisées pour envoyer votre message aux élu·e·s concerné·e·s.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='interpellation-3' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Puis-je espérer une réponse de la part des élu·e·s que j'interpelle via Éclaireur Public ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            La plateforme facilite la mise en relation, mais la réponse dépend uniquement des élu·e·s ou des services de la collectivité. Vous recevrez leur éventuel retour directement sur l'adresse e-mail que vous avez renseignée.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='interpellation-4' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Que va-t-il se passer suite à mon interpellation ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Votre message est transmis à la collectivité ou aux élu·e·s concernés. Vous recevez une copie par mail (si vous l'avez cochée). L'interpellation contribue à encourager la transparence et incite les collectivités à mettre leurs données à jour.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        {/* Existing general FAQ questions */}
        <ResponsiveAccordionItem value='item-1' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Quel est le rôle d'Éclaireur Public ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Éclaireur Public est un outil agrégateur des données publiques des collectivités/acteurs
            publics et privés, visant à promouvoir la transparence des finances publiques et
            encourager l'open data.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-2' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Puis-je avoir confiance en Éclaireur Public ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Éclaireur Public est porté par deux associations reconnues pour leur engagement en
            faveur de la transparence et contre la corruption. Anticor et Transparency
            International.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-3' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Ma collectivité ne diffuse aucune information d'intérêt général, comment cela se fait-il ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Certaines petites communes de moins de 3500 habitants peuvent ne pas être
            obligées de publier des données. Pour les autres collectivités, elles sont légalement
            tenues de le faire, et vous pouvez interpeller votre collectivité via la fonctionnalité
            d'interpellation.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-4' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Ma collectivité a publié ses données mais elles n'apparaissent pas sur Éclaireur Public, pourquoi ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Il se peut que l'outil n'ait pas pu récupérer les données depuis les plateformes de
            publication des collectivités. Encouragez votre collectivité à publier ses données sur
            data.gouv.fr.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-5' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Que puis-je faire si ma collectivité ne publie pas certaines informations publiques supposées être obligatoires ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Vous pouvez interpeller votre collectivité via le formulaire de contact d'Éclaireur
            Public pour demander la publication de ces données. En cas de non-réponse après un délai
            de 2 mois, vous pouvez vous adresser à la CADA via MaDada.fr pour effectuer une relance
            officielle.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-6' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Je souhaiterais communiquer des informations d'intérêt général sur ma collectivité, comment dois-je procéder ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Éclaireur Public est un outil de visualisation de données publiques, mais pour
            communiquer de nouvelles informations, vous pouvez vous référer à la documentation
            officielle de data.gouv.fr ou envoyer un message à Éclaireur Publique pour examiner plus
            précisément votre souhait.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-7' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Comment interpeller les élus de ma collectivité pour les inciter à communiquer des informations supposées être publiques ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Vous pouvez interroger directement les élus via le formulaire d'interpellation ou
            consulter les élections et leur mandat sur la fiche de collectivité.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-8' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            J'ai déjà alerté un ou des élus, rien ne se passe, quels sont mes recours ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            En cas de non-réponse des élus après vos interpellations, vous pouvez saisir la Commission d'accès aux documents administratifs (CADA) via le site MaDada.fr. Vous pouvez également contacter les associations partenaires d'Éclaireur Public (Anticor ou Transparency International France) pour obtenir des conseils supplémentaires.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-9' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Pourquoi l'Éclaireur Public ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Éclaireur Public est un projet visant à améliorer la transparence des collectivités
            locales, en rendant accessibles leurs données financières et les informations publiques
            relatives à leur gestion des fonds publics.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-10' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Que voulez-vous dire par collectivités ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Les collectivités incluent les communes, agglomérations, métropoles, communautés de
            communes, départements, régions, ainsi que les collectivités d'Outre-mer et les
            collectivités à statut particulier.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-11' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Que voulez-vous dire par acteur privé ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Un acteur privé est une organisation non étatique, susceptible de répondre à des appels
            d'offres publics ou impliquée dans des déclarations d'intérêts publiques.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-12' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Quel est le cadre légal ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            La loi pour une République numérique de 2016 qui vise à rendre plus transparentes les
            politiques publiques est LA référence légale. Certaines dispositions ont évolué et sont
            décrites dans notre page{' '}
            <Link href='/cadre-reglementaire' className='border-b-2 border-primary hover:text-primary'>
              Cadre réglementaire
            </Link>
            .
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-13' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Quelle est la méthodologie ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Techniquement, Éclaireur Public, c'est la collecte, le raffinement et la rationalisation
            de données. C'est aussi l'élaboration d'un indice de transparence adapté à la
            problématique de données sur les subventions et sur les marchés publics.
            <br />
            La démarche est décrite de manière transparente sur la page{' '}
            <Link href='/methodologie' className='border-b-2 border-primary hover:text-primary'>
              Méthodologie
            </Link>
            .
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-14' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Où puis-je télécharger les données utilisées ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Les données publiques utilisées par Éclaireur Public peuvent être téléchargées via la
            barre de navigation ou dans le bas de page en cliquant sur le bouton télécharger.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-15' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Je suis un élu et souhaiterais avoir un droit de réponse, comment faire ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Éclaireur Public permettra aux élus de répondre aux interpellations des citoyens dans
            une version future. Actuellement, les élus peuvent être contactés via notre{' '}
            <Link href='/contact' className='border-b-2 border-primary hover:text-primary'>
              formulaire de contact
            </Link>.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-16' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Je suis citoyen et souhaite interpeller ma collectivité, est-ce possible ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Oui, vous pouvez interpeller directement votre collectivité via le{' '}
            <Link href='/interpeller' className='border-b-2 border-primary hover:text-primary'>
              formulaire d'interpellation
            </Link>{' '}
            disponible sur les fiches des collectivités, afin de demander la publication des données
            manquantes.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>

        <ResponsiveAccordionItem value='item-17' className='border rounded-lg px-6'>
          <ResponsiveAccordionTrigger className='text-left text-lg font-semibold hover:text-primary'>
            Qui puis-je contacter pour des informations ?
          </ResponsiveAccordionTrigger>
          <ResponsiveAccordionContent className='text-muted-foreground pt-2'>
            Pour toute question, vous pouvez contacter Anticor ou Transparency International France via notre{' '}
            <Link href='/contact' className='border-b-2 border-primary hover:text-primary'>
              formulaire de contact
            </Link>.
          </ResponsiveAccordionContent>
        </ResponsiveAccordionItem>
      </ResponsiveAccordion>

      {/* Scroll to top button */}
      <div className='mt-12 text-center'>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='inline-flex items-center px-6 py-3 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors'
        >
          Retour en haut de page
        </button>
      </div>
    </div>
  );
}