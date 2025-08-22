// app/community/[siren]/components/FicheSubventions/FicheSubventions.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { FicheSubventions } from './FicheSubventions';

const meta: Meta<typeof FicheSubventions> = {
  // title: 'Community/FicheSubventions',
  component: FicheSubventions,
  parameters: {
    docs: {
      description: {
        component: 'Component displaying subventions data with tabs for different views.',
      },
    },
  },
  args: {
    siren: '213105554', // Default siren for stories
  },
};

export default meta;
type Story = StoryObj<typeof FicheSubventions>;

export const Default: Story = {
  args: {
    siren: '213105554',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state with subventions data displayed.',
      },
    },
  },
};

export const NoData: Story = {
  args: {
    siren: 'nodata',
  },
  parameters: {
    docs: {
      description: {
        story: 'State when no subventions data is available.',
      },
    },
  },
};

export const SingleSubvention: Story = {
  args: {
    siren: 'single',
  },
  parameters: {
    docs: {
      description: {
        story: 'State with only one subvention entry.',
      },
    },
  },
};

export const ManySubventions: Story = {
  args: {
    siren: 'many',
  },
  parameters: {
    docs: {
      description: {
        story: 'State with many subventions for testing pagination and performance.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    siren: 'error',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state when fetching subventions fails.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    siren: 'loading',
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with delayed data fetching.',
      },
    },
  },
};
