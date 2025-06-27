import { TransparencyScore } from "@/components/TransparencyScore/constants";

export type Bareme = {
  siren: string;
  annee: number;
  mp_score: TransparencyScore | null;
  subventions_score: TransparencyScore | null;
};