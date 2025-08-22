// utils/fetchers/subventions/__mocks__/fetchSubventionsAvailableYears.ts

export async function fetchSubventionsAvailableYears(): Promise<number[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return a mock array of available years
  return [2021, 2022, 2023];
}
