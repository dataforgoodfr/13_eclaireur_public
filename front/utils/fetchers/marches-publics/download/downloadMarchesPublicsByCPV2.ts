import { downloadURL } from '#utils/downloader/downloadURL';

import { Pagination } from '../../types';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
function getAPIRoute(communitySiren: string) {
  return `/api/communities/${communitySiren}/marches_publics/by_cpv_2/download`;
}

export function createMarchesPublicsByCPV2DownloadingURL(
  communitySiren: string,
  year: number | null,
  pagination?: Pagination,
): URL {
  const url = new URL(getAPIRoute(communitySiren), baseURL);

  if (year !== null) url.searchParams.append('year', year.toString());

  if (pagination) {
    const { page, limit } = pagination;
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
  }

  return url;
}

export function downloadMarchesPublicsByCPV2CSV(
  ...params: Parameters<typeof createMarchesPublicsByCPV2DownloadingURL>
) {
  const url = createMarchesPublicsByCPV2DownloadingURL(...params);

  downloadURL(url);
}
