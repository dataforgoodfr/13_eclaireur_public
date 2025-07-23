import { fn } from '@storybook/test';
import type { MarchePublic, MarchesPublicsParams } from './fetchMarchesPublics-server';

export const mockFetchMarchesPublics = fn<
    (options?: MarchesPublicsParams) => Promise<MarchePublic[]>
>().mockName('fetchMarchesPublics');

export { mockFetchMarchesPublics as fetchMarchesPublics };
