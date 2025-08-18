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
      <div className='min-h-screen flex flex-col'>
        <div className='flex-grow bg-white p-8'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-4xl font-bold text-blue-900 mb-6'>
              Page de démonstration
            </h1>
            <p className='text-lg text-gray-600 mb-4'>
              Cette page démontre le footer Éclaireur Public dans son contexte d'utilisation.
            </p>
            <p className='text-gray-600 mb-8'>
              Le footer contient toutes les informations essentielles : liens de navigation,
              partenaires, réseaux sociaux et mentions légales. La mascotte apparaît dans
              le coin supérieur droit du footer.
            </p>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-yellow-50 p-6 rounded-lg'>
                <h2 className='text-xl font-semibold text-blue-900 mb-2'>
                  Navigation
                </h2>
                <p className='text-gray-600'>
                  Le footer organise la navigation en trois colonnes principales.
                </p>
              </div>
              <div className='bg-blue-50 p-6 rounded-lg'>
                <h2 className='text-xl font-semibold text-blue-900 mb-2'>
                  Partenaires
                </h2>
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
        <div className='bg-white p-4 mb-4'>
          <h1 className='text-2xl font-bold text-blue-900 mb-2'>
            Vue Mobile
          </h1>
          <p className='text-gray-600'>
            Le footer s'adapte automatiquement aux écrans mobiles.
          </p>
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
        <div className='bg-white p-6 mb-4'>
          <h1 className='text-3xl font-bold text-blue-900 mb-2'>
            Vue Tablette
          </h1>
          <p className='text-gray-600'>
            Le footer maintient sa lisibilité sur tablettes.
          </p>
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