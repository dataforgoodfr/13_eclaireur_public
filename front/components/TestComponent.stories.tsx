import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import TestComponent from './TestComponent';

const meta: Meta<typeof TestComponent> = {
  title: 'Test/MSWComponent',
  component: TestComponent,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/test-data', () => {
          return HttpResponse.json({ message: 'Hello from MSW mock!' });
        }),
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TestComponent>;

export const Default: Story = {};
