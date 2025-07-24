import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
    stories: [
        '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-links',
    ],
    framework: {
        name: '@storybook/nextjs',
        options: {},
    },
    typescript: {
        check: false,
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
    staticDirs: ['../public'],
};

export default config;
