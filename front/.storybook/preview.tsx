import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '../app/globals.css';

// Initialize MSW
initialize();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Custom viewports for better desktop/mobile options
const customViewports = {
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1440px',
      height: '900px',
    },
    type: 'desktop',
  },
  laptop: {
    name: 'Laptop',
    styles: {
      width: '1024px',
      height: '768px',
    },
    type: 'desktop',
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        ...customViewports,
      },
    },
    react: {
      rsc: true,
      suspense: true,
    },
  },
  initialGlobals: {
    viewport: { value: 'desktop' },
  },
  decorators: [
    (Story) => {
      return (
        <NuqsAdapter>
          <QueryClientProvider client={queryClient} >
            <Story />
          </QueryClientProvider>
        </NuqsAdapter>
      );
    },
  ],
  loaders: [
    mswLoader
  ],
  tags: ['autodocs']
};

export default preview;
