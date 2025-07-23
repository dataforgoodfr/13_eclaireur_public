import { fn } from '@storybook/test';
import { fetchMarchesPublicsAvailableYears } from './fetchMarchesPublicsAvailableYears';

export const mockFetchMarchesPublicsAvailableYears = fn(fetchMarchesPublicsAvailableYears).mockName('fetchMarchesPublicsAvailableYears');
export { mockFetchMarchesPublicsAvailableYears as fetchMarchesPublicsAvailableYears };
