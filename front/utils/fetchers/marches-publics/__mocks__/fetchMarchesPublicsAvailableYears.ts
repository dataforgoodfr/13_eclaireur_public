// utils/fetchers/marches-publics/__mocks__/fetchMarchesPublicsAvailableYears.ts

export async function fetchMarchesPublicsAvailableYears(): Promise<number[]> {
    console.log('🎯 Mock fetchMarchesPublicsAvailableYears called');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Return a mock array of available years
    return [2021, 2022, 2023];
}
