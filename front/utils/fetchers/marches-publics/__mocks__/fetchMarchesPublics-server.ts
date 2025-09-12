import { fn } from '@storybook/test';

export * from '../fetchMarchesPublics-server';
export const fetchMarchesPublics = fn().mockName('fetchMarchesPublics');
