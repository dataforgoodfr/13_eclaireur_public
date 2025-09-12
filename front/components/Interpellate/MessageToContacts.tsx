// TODO: Review and remove unused variables. This file ignores unused vars for now.
/* eslint-disable @typescript-eslint/no-unused-vars */

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
      <p className='mb-4'>
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
        publics, je souhaite attirer votre attention sur l’obligation légale de publication des
        données d’investissements et de marchés publics pour les collectivités de plus de 3 500
        habitants.
      </p>
      <p className='mb-4'>
        Ces informations sont essentielles pour garantir une gestion claire et accessible des
        finances publiques. Elles permettent aux citoyen·nes de mieux comprendre les choix
        budgétaires, de renforcer la confiance dans les institutions et de s’assurer du bon usage de
        l’argent public.
      </p>
      <p className='mb-4'>
        Pourtant, à ce jour, ces données restent souvent incomplètes ou difficilement accessibles.
      </p>
      <p className='mb-4'>
        Je vous encourage donc à publier et mettre à jour ces données conformément aux obligations
        en vigueur, en facilitant leur consultation par l’ensemble des citoyen·nes. Une telle
        initiative contribuerait à une démocratie locale plus transparente et participative.
      </p>
      <p className='mb-4'>
        Je vous remercie par avance pour votre engagement sur ce sujet essentiel et reste à votre
        disposition pour échanger à ce propos.
      </p>
      <p className='mb-4'>
        Dans l’attente de votre réponse, veuillez agréer, Madame, Monsieur, l’expression de mes
        salutations distinguées.
      </p>
      <p className='mb-4'>{from && <>{from}</>}</p>
    </>
  );
}
