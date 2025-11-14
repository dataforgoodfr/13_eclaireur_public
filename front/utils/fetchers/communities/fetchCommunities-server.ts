import type { Community } from '#app/models/community';
import { getQueryFromPool } from '#utils/db';
import { formatCommunityType, formatDepartmentName, formatLocationName } from '#utils/format';
import { CommunityType } from '#utils/types';

import type { Pagination } from '../types';
import { type CommunitiesOptions, createSQLQueryParams } from './createSQLQueryParams';

/**
 * Fetch the communities (SSR) with options/filters
 * @param filters
 * @returns
 */
export async function fetchCommunities(
  options?: CommunitiesOptions,
  pagination?: Pagination,
): Promise<Community[]> {
  const params = createSQLQueryParams(options, pagination);

  const communities = (await getQueryFromPool(...params)) as Community[];

  // Normalize French location names
  return communities.map((community) => ({
    ...community,
    nom: formatLocationName(community.nom),
    formattedType: formatCommunityType(community.type as CommunityType),
    nom_departement: community.nom_departement
      ? formatDepartmentName(community.nom_departement)
      : null,
  }));
}
