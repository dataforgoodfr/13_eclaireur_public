import * as actual from '@/utils/db';
import { fn } from '@storybook/test';

export * from '@/utils/db';

export const getQueryFromPool = fn(actual.getQueryFromPool).mockName('getQueryFromPool');
