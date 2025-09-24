// TODO: Review and remove unused variables. This file ignores unused vars for now.
/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';

type MessageToContactsProps = {
  from: string;
  to: string;
  fonction?: string;
  communityName: string;
  communityType: string;
};
export default function MessageToContacts({
  from,
  to,
  fonction,
  communityName,
  communityType,
}: MessageToContactsProps) {
  const communityTitle = communityType === 'Commune' ? 'Maire' : 'Président.e';
  return (
    <>
      <p className='mb-4 font-bold'>
        {/* {to && <>À l’attention de {to}</>} */}
        {communityName && communityTitle && (
          <>
            À l’attention de M. ou Mme le ou la {communityTitle} de {communityName}
          </>
        )}
        {fonction && (
          <>
            <br />
            {fonction}
          </>
        )}
        {/* {communityName && (
          <>
            <br />
            {communityName}
          </>
        )} */}
      </p>
      <p className='mb-4'>Madame, Monsieur,</p>
      <p className='mb-4'>
        En tant que citoyen·ne soucieux·se de la transparence et de la bonne gestion des fonds
        publics, je souhaite attirer votre attention sur
        <span className='font-bold'>
          &nbsp;l’obligation légale de publication des données d’investissements et de marchés
          publics pour les collectivités de plus de 3 500 habitants et comptant au moins 50 agents à
          temps plein.
        </span>
      </p>
      <p className='mb-4'>
        Ces informations sont essentielles pour garantir une gestion claire et accessible des
        finances publiques. Elles permettent aux citoyen·nes de mieux comprendre les choix
        budgétaires, de renforcer la confiance dans les institutions et de s’assurer du bon usage de
        l’argent public.
      </p>
      <p className='mb-4 font-bold'>
        Or, à ce jour, ces données restent souvent incomplètes ou difficilement accessibles.
      </p>
      <p className='mb-4'>
        Je vous encourage donc à publier et mettre à jour ces informations conformément aux
        obligations en vigueur, en facilitant leur consultation par l’ensemble des citoyen·nes. Une
        telle initiative contribuerait à une démocratie locale plus transparente et participative.
      </p>
      <p className='mb-4'>
        <span className='font-bold'>👉 Pour en savoir plus </span>:{' '}
        <Link className='underline' href='https://www.eclaireurpublic.fr'>
          www.eclaireurpublic.fr
        </Link>
      </p>
      <p>
        <span className='font-bold'>Vous disposez bien entendu d’un droit de réponse. </span>
        &nbsp;Pour toute remarque, précision ou correction, vous pouvez contacter Anticor à :
        contact@anticor.com (adresse de contact dédiée).Pour améliorer le score de transparence de
        votre collectivité, vous pouvez transmettre les données manquantes :
        <ul className='my-4 list-disc pl-5'>
          <li>
            <span className='font-bold'>en les publiant directement sur </span>
            <Link className='underline' href='https://www.data.gouv.fr'>
              www.data.gouv.fr
            </Link>
            &nbsp;conformément aux démarches prévues,
          </li>
          <li>
            <span className='font-bold'>ou via la plateforme </span>
            <Link className='underline' href='https://publier.etalab.studio/fr'>
              https://publier.etalab.studio/fr
            </Link>
            .
          </li>
        </ul>
      </p>
      <p className='mb-4'>
        Pour plus d'informations, une page est dédiée sur le site :&nbsp;
        <Link className='underline' href='https://www.eclaireurpublic.fr/aide-aux-elus'>
          https://www.eclaireurpublic.fr/aide-aux-elus
        </Link>
        ,
      </p>
      <p className='mb-4'>
        Je vous remercie par avance pour votre engagement sur ce sujet essentiel et reste à votre
        disposition pour échanger à ce propos.
      </p>
      <p className='mb-4'>
        Dans l’attente de votre retour, veuillez agréer, Madame, Monsieur, l’expression de mes
        salutations distinguées.
      </p>
      <p className='mb-4'>{from && <>{from}</>}</p>
    </>
  );
}
