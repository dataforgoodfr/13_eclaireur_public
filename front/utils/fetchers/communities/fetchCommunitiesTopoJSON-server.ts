import { CommunityTopoJSONModel } from '@/app/api/geojson_communities/model';
import { CommunityType } from '@/utils/types';
import { topology } from 'topojson-server';

import { getQueryFromPool } from '../../db';

/**
 * Create the SQL query to search by query and page
 * @param query
 * @param page starts at 1
 * @returns
 */
export function createSQLQueryParams(type: CommunityType): [string, (string | number)[]] {
  const querySQL = `
      WITH features AS (
        SELECT jsonb_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(geometry_simplified_001)::jsonb,
          'properties', jsonb_build_object(
            'type', type,
            'libgeo', libgeo
          )
        ) AS feature
        FROM geo_data
        WHERE type = '${type}'
      )

      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(feature)
      )::json as geojson
      FROM features;
  `;

  return [querySQL, []];
}

/**
 * Fetch the communities (SSR) by query search
 */
export async function fetchCommunitiesGeoJSON(type: CommunityType): Promise<GeoJSON.GeoJsonObject> {
  const params = createSQLQueryParams(type);

  const result = (await getQueryFromPool(...params)) as [{ geojson: GeoJSON.GeoJsonObject }];

  const [{ geojson }] = result;

  return geojson;
}

/**
 * Fetch the topoJSON of the communities (SSR) (COM, DEP, REG)
 */
export async function fetchCommunitiesTopoJSON(): Promise<CommunityTopoJSONModel> {
  const [communes, departements, regions] = await Promise.all([
    fetchCommunitiesGeoJSON(CommunityType.Commune),
    fetchCommunitiesGeoJSON(CommunityType.Departement),
    fetchCommunitiesGeoJSON(CommunityType.Region),
  ]);

  const topoJSON: CommunityTopoJSONModel = topology({
    communes,
    departements,
    regions,
  }) as CommunityTopoJSONModel;

  return topoJSON;
}
