import { NextResponse } from 'next/server';

import db from '@/utils/db';
import { CommunityType } from '@/utils/types';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { QueryResult } from 'pg';
import { topology } from 'topojson-server';

import { CommunityGeoJSONModel } from './model';

type CommunityFeature = Feature<Geometry, Omit<CommunityGeoJSONModel, 'geometry'>>;

function mapRowToGeoJSONFeatures(row: CommunityGeoJSONModel): CommunityFeature {
  return {
    type: 'Feature' as const,
    properties: {
      codgeo: row.codgeo,
      dep: row.dep,
      reg: row.reg,
      libgeo: row.libgeo,
      type: row.type,
    },
    geometry: JSON.parse(row.geometry),
  };
}

function mapToGeoJSONs(rows: CommunityGeoJSONModel[]): {
  communes: FeatureCollection;
  departements: FeatureCollection;
  regions: FeatureCollection;
} {
  const initialAcc: {
    communes: CommunityFeature[];
    departements: CommunityFeature[];
    regions: CommunityFeature[];
  } = {
    communes: [],
    departements: [],
    regions: [],
  };

  const allFeatures = rows.reduce((acc, row) => {
    if (row.type === CommunityType.Commune) {
      return {
        ...acc,
        communes: [...acc.communes, mapRowToGeoJSONFeatures(row)],
      };
    }

    if (row.type === CommunityType.Departement) {
      return {
        ...acc,
        departements: [...acc.departements, mapRowToGeoJSONFeatures(row)],
      };
    }

    if (row.type === CommunityType.Region) {
      return {
        ...acc,
        regions: [...acc.regions, mapRowToGeoJSONFeatures(row)],
      };
    }

    throw new Error('Community type unknown for geojson mapping' + row.type);
  }, initialAcc);

  const GeoJSONCommunes: FeatureCollection = {
    type: 'FeatureCollection',
    features: allFeatures.communes,
  };
  const GeoJSONDepartements: FeatureCollection = {
    type: 'FeatureCollection',
    features: allFeatures.departements,
  };
  const GeoJSONRegions: FeatureCollection = {
    type: 'FeatureCollection',
    features: allFeatures.regions,
  };

  return {
    communes: GeoJSONCommunes,
    departements: GeoJSONDepartements,
    regions: GeoJSONRegions,
  };
}

export async function GET() {
  const client = await db.connect();
  try {
    const query = `SELECT codgeo, dep, reg, libgeo, type, ST_AsGeoJSON(geometry_simplified_001) AS geometry
                    FROM geo_data;`;

    const { rows } = (await client.query(query)) as QueryResult<CommunityGeoJSONModel>;

    const allGeoJSONs = mapToGeoJSONs(rows);

    const topoJSON = topology(allGeoJSONs);

    return NextResponse.json(topoJSON);
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Failed to fetch map data');
  } finally {
    client.release();
  }
}
