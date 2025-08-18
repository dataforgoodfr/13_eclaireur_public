import FAQBanner from '#components/FAQBanner';

const interpellateQuestions = [
  {
    id: 'interpellate-1',
    question: 'Puis-je interpeller les élu·e·s de manière anonyme ?',
    answer: 'Non, l\'interpellation doit être nominative afin de garantir sa légitimité. En revanche, vos coordonnées ne sont utilisées que pour transmettre votre message et ne sont pas exploitées à d\'autres fins.',
  },
  {
    id: 'interpellate-2',
    question: 'Mes données sont-elles conservées par Éclaireur Public ?',
    answer: 'Non. Éclaireur Public ne conserve pas le contenu de vos interpellations ni vos coordonnées personnelles. Vos informations sont uniquement utilisées pour envoyer votre message aux élu·e·s concerné·e·s.',
  },
  {
    id: 'interpellate-3',
    question: 'Puis-je espérer une réponse de la part des élu·e·s que j\'interpelle via Éclaireur Public ?',
    answer: 'La plateforme facilite la mise en relation, mais la réponse dépend uniquement des élu·e·s ou des services de la collectivité. Vous recevrez leur éventuel retour directement sur l\'adresse e-mail que vous avez renseignée.',
  },
  {
    id: 'interpellate-4',
    question: 'Que va-t-il se passer suite à mon interpellation ?',
    answer: 'Votre message est transmis à la collectivité ou aux élu·e·s concernés. Vous recevez une copie par mail (si vous l\'avez cochée). L\'interpellation contribue à encourager la transparence et incite les collectivités à mettre leurs données à jour.',
  },
];

export default function InterpellateFAQ() {
  return (
    <FAQBanner
      title='Questions fréquentes'
      subtitle='Des questions sur l\'interpellation ? Trouvez vos réponses ici.'
      questions={interpellateQuestions}
      buttonText='Voir toutes les questions'
      buttonHref='/faq'
      variant='interpellate'
    />
  );
}