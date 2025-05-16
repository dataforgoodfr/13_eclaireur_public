type MessageToContactsProps = {
  from?: string;
  to?: string;
  fonction?: string;
  communityName?: string;
};
export default function MessageToContacts({
  from,
  to,
  fonction,
  communityName,
}: MessageToContactsProps) {
  return (
    <>
      <p>
        {to && <>À l’attention de {to}</>}
        {fonction && (
          <>
            <br />
            {fonction}
          </>
        )}
        {communityName && (
          <>
            <br />
            {communityName}
          </>
        )}
      </p>
      <p>Madame, Monsieur,</p>
      <p>
        En tant que citoyen·ne soucieux·se de la transparence et de la bonne gestion des fonds
        publics, je souhaite attirer votre attention sur l’obligation légale de publication des
        données d’investissements et de marchés publics pour les collectivités de plus de 3 500
        habitants.
      </p>
      <p>
        Ces informations sont essentielles pour garantir une gestion claire et accessible des
        finances publiques. Elles permettent aux citoyen·nes de mieux comprendre les choix
        budgétaires, de renforcer la confiance dans les institutions et de s’assurer du bon usage de
        l’argent public. Pourtant, à ce jour, ces données restent souvent incomplètes ou
        difficilement accessibles.
      </p>
      <p>
        Je vous encourage donc à publier et mettre à jour ces données conformément aux obligations
        en vigueur, en facilitant leur consultation par l’ensemble des citoyen·nes. Une telle
        initiative contribuerait à une démocratie locale plus transparente et participative.
      </p>
      <p>
        Je vous remercie par avance pour votre engagement sur ce sujet essentiel et reste à votre
        disposition pour échanger à ce propos.
      </p>
      <p>
        Dans l’attente de votre réponse, veuillez agréer, Madame, Monsieur, l’expression de mes
        salutations distinguées.
      </p>
      <p>{from}</p>
    </>
  );
}
