// function to fetch only for the communities in the viewport
export const fetchMissingData = async (
  codesToFetch: string[],
  fetchFunction: (codes: string[]) => Promise<any[]>,
  cacheRef: React.RefObject<any[]>,
  setFetchedCodes: React.Dispatch<React.SetStateAction<Set<string>>>,
) => {
  if (codesToFetch.length > 0) {
    const newData = await fetchFunction(codesToFetch);
    cacheRef.current = [...cacheRef.current, ...newData];
    setFetchedCodes((prev) => {
      const newSet = new Set(prev);
      codesToFetch.forEach((code) => newSet.add(code));
      return newSet;
    });
  }
};
