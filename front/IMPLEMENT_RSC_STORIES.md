# Integrating React Server Components (RSC) with Storybook

This guide outlines the steps to integrate React Server Components (RSC) into your Next.js application and test them with Storybook.

## 1. Install Dependencies

First, you need to install the experimental Vite framework for Storybook and the MSW addon for mocking data.

```bash
yarn add @storybook/experimental-nextjs-vite msw-storybook-addon --dev
```

## 2. Update Storybook Configuration

Next, you need to update your Storybook configuration to use the experimental Vite framework and enable RSC support.

In `front/.storybook/main.ts`, make the following changes:

```typescript
import type { StorybookConfig } from '@storybook/experimental-nextjs-vite';

const config: StorybookConfig = {
    stories: [
        '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
        '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-links',
        'msw-storybook-addon', // Add this line
    ],
    framework: {
        name: '@storybook/experimental-nextjs-vite', // Update this line
        options: {},
    },
    features: {
        experimentalRSC: true, // Add this line
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
```

## 3. Set up Mock Service Worker (MSW)

To test your RSCs in Storybook, you'll need to mock the data they fetch. MSW is a great tool for this.

1.  Create a `mocks` directory in the `front` directory.
2.  Inside `front/mocks`, create a `handlers.js` file to define your API mocks.
3.  Create a `browser.js` file to set up the MSW browser worker.
4.  Create a `server.js` file to set up the MSW server worker.

For detailed instructions on setting up MSW, please refer to the [MSW documentation](https://mswjs.io/docs/).

## 4. Create a Story for an RSC

Now you can create stories for your RSCs. The key is to use the `msw` addon to mock the data that your RSC fetches.

Here's an example of a story for a `CommunityList` component that fetches a list of communities from an API:

```typescript
// components/CommunityList.stories.tsx

import { type Meta, type StoryObj } from '@storybook/react';
import { rest } from 'msw';
import { CommunityList } from './CommunityList';

const meta = {
    component: CommunityList,
    parameters: {
        msw: {
            handlers: [
                rest.get('/api/communities', (req, res, ctx) => {
                    return res(
                        ctx.json([
                            { id: 1, name: 'Community 1' },
                            { id: 2, name: 'Community 2' },
                        ])
                    );
                }),
            ],
        },
    },
} satisfies Meta<typeof CommunityList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

In this example, the `msw` parameter in the story's `parameters` is used to define a mock handler for the `/api/communities` endpoint. When the `CommunityList` component is rendered in Storybook, it will fetch data from this mock endpoint instead of the real API.