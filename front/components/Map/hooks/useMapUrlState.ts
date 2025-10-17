import { DEFAULT_MAP_YEAR } from '#utils/constants/years';
import {
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs';

export const mapUrlStateParser = {
  zoom: parseAsInteger.withDefault(5).withOptions({ clearOnDefault: false }),
  lat: parseAsFloat.withOptions({ clearOnDefault: false }),
  lng: parseAsFloat.withOptions({ clearOnDefault: false }),
  year: parseAsInteger.withDefault(DEFAULT_MAP_YEAR),
  score: parseAsString.withDefault('mp_score'),
  level: parseAsStringEnum(['regions', 'departements', 'communes', 'auto']).withDefault('auto'),
};

export type MapUrlState = {
  zoom: number;
  lat: number | null;
  lng: number | null;
  year: number;
  score: string;
  level: 'regions' | 'departements' | 'communes' | 'auto';
};

export function useMapUrlState() {
  return useQueryStates(mapUrlStateParser, {
    history: 'push',
    shallow: true,
  });
}
