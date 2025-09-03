import { downloadURL } from '#utils/downloader/downloadURL';

function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/marches_publics/contrats/download`;
}

export function createMarchesPublicsContratsDownloadingURL(
  communitySiren: string,
  year: number,
): URL {
  const url = new URL(getAPIRoute(communitySiren), window.location.origin);
  url.searchParams.append('year', year.toString());

  return url;
}

export function downloadMarchesPublicsContratsCSV(
  ...params: Parameters<typeof createMarchesPublicsContratsDownloadingURL>
) {
  const url = createMarchesPublicsContratsDownloadingURL(...params);

  downloadURL(url);
}
