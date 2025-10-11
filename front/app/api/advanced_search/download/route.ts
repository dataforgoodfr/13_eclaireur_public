import { NextResponse } from 'next/server';

import { DEFAULT_ORDER, ExportType } from '#app/api/advanced_search/advancedSearchUtils';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { fetchCommunitiesAdvancedSearch } from '#utils/fetchers/advanced-search/fetchCommunitiesAdvancedSearch-server';
import { CommunityType } from '#utils/types';
import { formatNomsPropres, stringifyCommunityType } from '#utils/utils';
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';
import * as XLSX from 'xlsx';

const DEFAULT_FILE_NAME = 'RechercheAvancee';
const MAX_NUMBER_ROWS = 1_000_000;

const HEADERS = [
  'Siren',
  'Collectivite',
  'Type',
  'Population',
  'Budget Subventions (€)',
  'Score Marchés Publics',
  'Score Subventions',
];
const CSV_SEPARATOR = ';';

const searchParamsCache = createSearchParamsCache({
  by: parseAsStringEnum([
    'nom',
    'type',
    'population',
    'mp_score',
    'subventions_score',
    'subventions_budget',
  ] as const).withDefault(DEFAULT_ORDER.by),
  direction: parseAsStringEnum(['ASC', 'DESC'] as const).withDefault(DEFAULT_ORDER.direction),
  type: parseAsString,
  population: parseAsInteger,
  mp_score: parseAsString,
  subventions_score: parseAsString,
  exportType: parseAsStringEnum(Object.values(ExportType)).withDefault(ExportType.Csv),
});

function getFormatedCurrentDate() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return `${yyyy}${MM}${dd}_${hh}${mm}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = searchParamsCache.parse(
      searchParams as unknown as Record<string, string | string[] | undefined>,
    );

    const filters = {
      type: (params.type as CommunityType) ?? undefined,
      population: params.population ?? undefined,
      mp_score: (params.mp_score as TransparencyScore) ?? undefined,
      subventions_score: (params.subventions_score as TransparencyScore) ?? undefined,
    };

    const pagination = {
      page: 1,
      limit: MAX_NUMBER_ROWS,
    };

    const order = {
      by: params.by,
      direction: params.direction,
    };

    const data = await fetchCommunitiesAdvancedSearch(filters, pagination, order);
    const formattedData = data.map((row) => {
      return [
        row.siren,
        formatNomsPropres(row.nom),
        stringifyCommunityType(row.type as CommunityType),
        row.population?.toString() ?? '',
        row.subventions_budget?.toString() ?? '',
        row.mp_score?.toString() ?? '',
        row.subventions_score?.toString() ?? '',
      ];
    });

    let response: string;
    let headers: Headers;

    if (params.exportType == ExportType.Csv) {
      response = HEADERS.join(CSV_SEPARATOR) + '\n';
      response = response + formattedData.map((row) => row.join(CSV_SEPARATOR)).join('\n');

      headers = new Headers({
        'Content-Disposition': `attachment; filename=${DEFAULT_FILE_NAME}_${getFormatedCurrentDate()}.csv`,
        'Content-Type': 'text/csv; charset=utf-8',
      });
    } else {
      // Create a new XLSX workbook:
      const workbook = XLSX.utils.book_new();
      // Create a new worksheet:
      const worksheet = XLSX.utils.json_to_sheet([HEADERS].concat(formattedData), {
        skipHeader: true,
      });
      // Append the worksheet to the workbook:
      XLSX.utils.book_append_sheet(workbook, worksheet, 'MySheet');
      // Create data buffer
      response = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      headers = new Headers({
        'Content-Disposition': `attachment; filename=${DEFAULT_FILE_NAME}_${getFormatedCurrentDate()}.xlsx`,
        'Content-Type': 'application/vnd.ms-excel',
      });
    }

    return new NextResponse(response, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.log('Error while fetching CSV:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching CSV' },
      { status: 500 },
    );
  }
}
