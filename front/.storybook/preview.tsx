import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Kanit } from 'next/font/google';
import '../app/globals.css';
import { customViewports } from './utils';

const kanit = Kanit({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit',
  display: 'swap',
  subsets: ['latin'],
  fallback: ['system-ui', 'sans-serif'],
});

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
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
    viewport: {
      defaultViewport: 'desktopLarge',
      viewports: {
        ...customViewports,
        // ...MINIMAL_VIEWPORTS,
      },
    },
    react: {
      rsc: true,
      suspense: true,
    },
  },
  // initialGlobals: {
  //   viewport: { value: 'desktop' },
  // },
  decorators: [
    (Story) => {
      return (
        <div className={kanit.variable}>
          <NuqsAdapter>
            <QueryClientProvider client={queryClient} >
              <Story />
            </QueryClientProvider>
          </NuqsAdapter>
        </div>
      );
    },
  ],
  loaders: [
    mswLoader
  ],
  tags: ['autodocs']
};

export default preview;
