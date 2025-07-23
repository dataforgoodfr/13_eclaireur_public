import type { StorybookConfig } from '@storybook/nextjs';
import { resolve } from 'node:path';

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {
      "builder": {
        "name": "@storybook/builder-vite",
        "options": {}
      }
    }
  },
  features: {
    experimentalRSC: true,
  },
  "staticDirs": [
    "../public"
  ],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Mock the database utility to avoid pg-native issues
        '@/utils/db': resolve(__dirname, '../utils/db.mock.ts'),
        // Mock marches publics fetchers
        '@/utils/fetchers/marches-publics/fetchMarchesPublics-server': resolve(
          __dirname,
          '../utils/fetchers/marches-publics/fetchMarchesPublics-server.mock.ts'
        ),
        '@/utils/fetchers/marches-publics/fetchMarchesPublicsAvailableYears': resolve(
          __dirname,
          '../utils/fetchers/marches-publics/fetchMarchesPublicsAvailableYears.mock.ts'
        ),
      };

      // Add fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pg-native': false,
        'dns': false,
        'net': false,
        'tls': false,
        'fs': false,
        'path': false,
        'crypto': false,
      };
    }

    return config;
  },
};
export default config;
