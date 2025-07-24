import { fn } from '@storybook/test';
import * as actual from './fetchMarchesPublicsAvailableYears';


// import * as actual from './session'

export * from './fetchMarchesPublicsAvailableYears';
export const fetchMarchesPublicsAvailableYears = fn(actual.fetchMarchesPublicsAvailableYears).mockName('fetchMarchesPublicsAvailableYears')


// export const mockFetchMarchesPublicsAvailableYears = fn(fetchMarchesPublicsAvailableYears).mockName('fetchMarchesPublicsAvailableYears');
// export { mockFetchMarchesPublicsAvailableYears as fetchMarchesPublicsAvailableYears };
