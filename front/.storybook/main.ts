import type { StorybookConfig } from '@storybook/nextjs';

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
    "options": {}
  },
  features: {
    experimentalRSC: true,
  },
  "staticDirs": [
    "../public"
  ],
  webpackFinal: async (config) => {
    if (config.resolve) {
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
