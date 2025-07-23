import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
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

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
    react: {
      rsc: true,
      suspense: true,
    },
  },
  decorators: [
    (Story) => {
      // console.log('Rendering Story component...');
      return (
        <QueryClientProvider client={queryClient} >
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  loaders: [
    mswLoader
  ],
  tags: ['autodocs'],
};

export default preview;
