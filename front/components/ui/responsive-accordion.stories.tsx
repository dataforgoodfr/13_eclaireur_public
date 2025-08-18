import type { Meta, StoryObj } from '@storybook/react';
import {
  ResponsiveAccordion,
  ResponsiveAccordionContent,
  ResponsiveAccordionItem,
  ResponsiveAccordionTrigger,
} from './responsive-accordion';

const meta: Meta<typeof ResponsiveAccordion> = {
  title: 'UI/ResponsiveAccordion',
  component: ResponsiveAccordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Accordéon responsive avec comportement adaptatif : exclusif sur mobile (un seul ouvert), multiple sur desktop.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['single', 'multiple'],
      description: 'Type d\'accordéon (ignoré sur mobile avec mobileExclusive)',
    },
    collapsible: {
      control: { type: 'boolean' },
      description: 'Permet de fermer tous les accordéons',
    },
    mobileExclusive: {
      control: { type: 'boolean' },
      description: 'Force le mode single sur mobile',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const AccordionExample = ({ type, collapsible, mobileExclusive }: any) => (
  <ResponsiveAccordion 
    type={type} 
    collapsible={collapsible} 
    mobileExclusive={mobileExclusive}
    className="w-full max-w-md space-y-2"
  >
    <ResponsiveAccordionItem value="item-1" className="border rounded-lg">
      <ResponsiveAccordionTrigger className="px-4">
        Première question importante
      </ResponsiveAccordionTrigger>
      <ResponsiveAccordionContent className="px-4">
        Voici une réponse détaillée à la première question. Elle contient des informations importantes.
      </ResponsiveAccordionContent>
    </ResponsiveAccordionItem>

    <ResponsiveAccordionItem value="item-2" className="border rounded-lg">
      <ResponsiveAccordionTrigger className="px-4">
        Deuxième question sur le fonctionnement
      </ResponsiveAccordionTrigger>
      <ResponsiveAccordionContent className="px-4">
        Une autre réponse avec plus de contenu pour expliquer le fonctionnement détaillé de cette fonctionnalité.
      </ResponsiveAccordionContent>
    </ResponsiveAccordionItem>

    <ResponsiveAccordionItem value="item-3" className="border rounded-lg">
      <ResponsiveAccordionTrigger className="px-4">
        Troisième question technique
      </ResponsiveAccordionTrigger>
      <ResponsiveAccordionContent className="px-4">
        Cette réponse explique les aspects techniques et donne des détails sur l'implémentation.
      </ResponsiveAccordionContent>
    </ResponsiveAccordionItem>
  </ResponsiveAccordion>
);

export const SingleCollapsible: Story = {
  render: (args) => <AccordionExample {...args} />,
  args: {
    type: 'single',
    collapsible: true,
    mobileExclusive: false,
  },
};

export const Multiple: Story = {
  render: (args) => <AccordionExample {...args} />,
  args: {
    type: 'multiple',
    collapsible: true,
    mobileExclusive: false,
  },
};

export const MobileExclusive: Story = {
  render: (args) => <AccordionExample {...args} />,
  args: {
    type: 'multiple',
    collapsible: true,
    mobileExclusive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Mode exclusif mobile : sur mobile, un seul accordéon ouvert à la fois. Sur desktop, plusieurs accordéons peuvent être ouverts simultanément.',
      },
    },
  },
};

export const NonCollapsible: Story = {
  render: (args) => <AccordionExample {...args} />,
  args: {
    type: 'single',
    collapsible: false,
    mobileExclusive: false,
  },
};