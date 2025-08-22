import { NextRequest } from 'next/server';

import { getQueryFromPool } from '#utils/db';
import { DataTable } from '#utils/fetchers/constants';
import { CommunityType } from '#utils/types';

const COMMUNITIES = DataTable.Communities;
const BAREME = DataTable.Bareme;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') as CommunityType | null;
  const population = searchParams.get('population')
    ? parseInt(searchParams.get('population')!)
    : null;
  const mp_score = searchParams.get('mp_score');
  const subventions_score = searchParams.get('subventions_score');

  try {
    const filterOptions = await fetchFilterOptions({
      type,
      population,
      mp_score,
      subventions_score,
    });

    return Response.json(filterOptions);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return Response.json({ error: 'Failed to fetch filter options' }, { status: 500 });
  }
}

interface FilterParams {
  type?: CommunityType | null;
  population?: number | null;
  mp_score?: string | null;
  subventions_score?: string | null;
}

async function fetchFilterOptions(filters: FilterParams) {
  const { type, population, mp_score, subventions_score } = filters;
  const values: (CommunityType | number | string)[] = [];

  let baseQuery = `
    SELECT DISTINCT
      c.type,
      c.population,
      b.mp_score,
      b.subventions_score
    FROM ${COMMUNITIES} c
    LEFT JOIN ${BAREME} b ON c.siren = b.siren AND b.annee = $${values.length + 1}
    WHERE c.nom IS NOT NULL
  `;
  values.push(2024);

  const whereConditions = [];

  if (type) {
    whereConditions.push(`c.type = $${values.length + 1}`);
    values.push(type);
  }
  if (population) {
    whereConditions.push(`c.population <= $${values.length + 1}`);
    values.push(population);
  }
  if (mp_score) {
    whereConditions.push(`b.mp_score = $${values.length + 1}`);
    values.push(mp_score);
  }
  if (subventions_score) {
    whereConditions.push(`b.subventions_score = $${values.length + 1}`);
    values.push(subventions_score);
  }

  if (whereConditions.length > 0) {
    baseQuery += ` AND ${whereConditions.join(' AND ')}`;
  }

  const results = (await getQueryFromPool(baseQuery, values)) as Array<{
    type: CommunityType;
    population: number;
    mp_score: string | null;
    subventions_score: string | null;
  }>;

  // Extract unique values for each filter
  const types = [...new Set(results.map((r) => r.type).filter(Boolean))];

  // For populations, use predefined ranges that make sense based on available data
  const allPopulations = results.map((r) => r.population).filter(Boolean);
  const maxPopulation = Math.max(...allPopulations);
  const populationRanges = [
    2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000,
  ];
  const populations = populationRanges.filter((range) => range <= maxPopulation * 1.5);

  const mpScores = [...new Set(results.map((r) => r.mp_score).filter(Boolean))];
  const subventionsScores = [...new Set(results.map((r) => r.subventions_score).filter(Boolean))];

  return {
    types,
    populations,
    mpScores,
    subventionsScores,
  };
}
