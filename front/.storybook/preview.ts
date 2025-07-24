import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import '../app/globals.css';

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
    },
    tags: ['autodocs'],
};

export default preview;
