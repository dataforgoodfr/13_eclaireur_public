import type { Meta, StoryObj } from '@storybook/react';
import FAQBanner from './FAQBanner';

const defaultQuestions = [
  {
    id: 'q1',
    question: 'Puis-je interpeller les élu·e·s de manière anonyme ?',
    answer: 'Non, l\'interpellation doit être nominative afin de garantir sa légitimité. En revanche, vos coordonnées ne sont utilisées que pour transmettre votre message et ne sont pas exploitées à d\'autres fins.',
  },
  {
    id: 'q2',
    question: 'Mes données sont-elles conservées par Éclaireur Public ?',
    answer: 'Non. Éclaireur Public ne conserve pas le contenu de vos interpellations ni vos coordonnées personnelles. Vos informations sont uniquement utilisées pour envoyer votre message aux élu·e·s concerné·e·s.',
  },
  {
    id: 'q3',
    question: 'Puis-je espérer une réponse de la part des élu·e·s que j\'interpelle via Éclaireur Public ?',
    answer: 'La plateforme facilite la mise en relation, mais la réponse dépend uniquement des élu·e·s ou des services de la collectivité. Vous recevrez leur éventuel retour directement sur l\'adresse e-mail que vous avez renseignée.',
  },
  {
    id: 'q4',
    question: 'Que va-t-il se passer suite à mon interpellation ?',
    answer: 'Votre message est transmis à la collectivité ou aux élu·e·s concernés. Vous recevez une copie par mail (si vous l\'avez cochée). L\'interpellation contribue à encourager la transparence et incite les collectivités à mettre leurs données à jour.',
  },
];

const meta: Meta<typeof FAQBanner> = {
  title: 'Components/FAQBanner',
  component: FAQBanner,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Composant bandeau FAQ réutilisable avec accordéons responsives. Comportement exclusif sur mobile (un seul accordéon ouvert) et multiple sur desktop.',
      },
    },
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Titre du bandeau FAQ',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Sous-titre explicatif',
    },
    questions: {
      control: { type: 'object' },
      description: 'Tableau des questions/réponses',
    },
    buttonText: {
      control: { type: 'text' },
      description: 'Texte du bouton "Voir toutes les questions"',
    },
    buttonHref: {
      control: { type: 'text' },
      description: 'URL du bouton "Voir toutes les questions"',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'interpellate'],
      description: 'Style du bandeau (default: avec bordure, interpellate: intégré)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Questions fréquentes',
    subtitle: 'Trouvez rapidement les réponses à vos questions les plus courantes.',
    questions: defaultQuestions,
    buttonText: 'Voir toutes les questions',
    buttonHref: '/faq',
    variant: 'default',
  },
};

export const InterpellateVariant: Story = {
  args: {
    title: 'Questions fréquentes',
    subtitle: 'Des questions sur l\'interpellation ? Trouvez vos réponses ici.',
    questions: defaultQuestions,
    buttonText: 'Voir toutes les questions',
    buttonHref: '/faq',
    variant: 'interpellate',
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'Vous avez des questions ?',
    subtitle: 'Nous avons les réponses !',
    questions: defaultQuestions.slice(0, 2), // Only first 2 questions
    buttonText: 'Plus d\'informations',
    buttonHref: '/help',
    variant: 'default',
  },
};

export const MinimalQuestions: Story = {
  args: {
    title: 'FAQ Rapide',
    questions: [
      {
        id: 'minimal1',
        question: 'Question courte ?',
        answer: 'Réponse courte et directe.',
      },
      {
        id: 'minimal2',
        question: 'Autre question ?',
        answer: 'Autre réponse avec un peu plus de <strong>contenu HTML</strong> pour tester.',
      },
    ],
    variant: 'default',
  },
};

export const NoSubtitle: Story = {
  args: {
    title: 'Questions fréquentes',
    subtitle: undefined,
    questions: defaultQuestions,
    variant: 'default',
  },
};

export const ManyQuestions: Story = {
  args: {
    title: 'FAQ Complète',
    subtitle: 'Toutes nos questions et réponses détaillées.',
    questions: [
      ...defaultQuestions,
      {
        id: 'q5',
        question: 'Comment fonctionne la plateforme ?',
        answer: 'Éclaireur Public collecte les données publiques des collectivités et les présente de manière accessible aux citoyens.',
      },
      {
        id: 'q6',
        question: 'Qui peut utiliser la plateforme ?',
        answer: 'Tous les citoyens peuvent consulter les données et interpeller leurs élus via la plateforme.',
      },
      {
        id: 'q7',
        question: 'Les données sont-elles à jour ?',
        answer: 'Les données sont collectées régulièrement depuis les sources officielles et mises à jour automatiquement.',
      },
    ],
    variant: 'default',
  },
};