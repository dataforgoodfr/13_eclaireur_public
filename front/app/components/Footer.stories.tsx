import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import Footer from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        push: fn(),
        replace: fn(),
        back: fn(),
        forward: fn(),
        refresh: fn(),
        prefetch: fn(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithPageContent: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='flex min-h-screen flex-col'>
        <div className='flex-grow bg-white p-8'>
          <div className='mx-auto max-w-4xl'>
            <h1 className='mb-6 text-4xl font-bold text-blue-900'>Page de démonstration</h1>
            <p className='mb-4 text-lg text-gray-600'>
              Cette page démontre le footer Éclaireur Public dans son contexte d'utilisation.
            </p>
            <p className='mb-8 text-gray-600'>
              Le footer contient toutes les informations essentielles : liens de navigation,
              partenaires, réseaux sociaux et mentions légales. La mascotte apparaît dans le coin
              supérieur droit du footer.
            </p>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='rounded-lg bg-yellow-50 p-6'>
                <h2 className='mb-2 text-xl font-semibold text-blue-900'>Navigation</h2>
                <p className='text-gray-600'>
                  Le footer organise la navigation en trois colonnes principales.
                </p>
              </div>
              <div className='rounded-lg bg-blue-50 p-6'>
                <h2 className='mb-2 text-xl font-semibold text-blue-900'>Partenaires</h2>
                <p className='text-gray-600'>
                  Les logos des partenaires sont cliquables et mènent vers leurs sites officiels.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className='min-h-screen bg-gray-100'>
        <div className='mb-4 bg-white p-4'>
          <h1 className='mb-2 text-2xl font-bold text-blue-900'>Vue Mobile</h1>
          <p className='text-gray-600'>Le footer s'adapte automatiquement aux écrans mobiles.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    (Story) => (
      <div className='min-h-screen bg-gray-100'>
        <div className='mb-4 bg-white p-6'>
          <h1 className='mb-2 text-3xl font-bold text-blue-900'>Vue Tablette</h1>
          <p className='text-gray-600'>Le footer maintient sa lisibilité sur tablettes.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const FooterOnly: Story = {
  name: 'Footer seul',
  args: {},
  decorators: [
    (Story) => (
      <div className='bg-gray-200 p-8'>
        <Story />
      </div>
    ),
  ],
};
