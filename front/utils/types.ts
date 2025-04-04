import { z } from 'zod';





export enum CommunityType {
  Region = 'REG',
  Departement = 'DEP',
  Commune = 'COM',
  /** Metropole au sens de la ville principale d une region geographique */
  Metropole = 'MET',
  /** Collectivite territoriale unique (ex: Corse, Martinique, Guyane) */
  CTU = 'CTU',
  /** Communaute d'agglomerations */
  CA = 'CA',
  /** Communaute de communes */
  CC = 'CC',
  /** Etablissement public territorial */
  EPT = 'EPT',
}

export const InterpellateFormSchema = z.object({
  firstname: z.string().min(2, {
    message: 'Veuillez saisir votre prénom, celui-ci doit contenir au moins 2 caractères',
  }),
  lastname: z.string().min(2, {
    message: 'Veuillez saisir votre nom de famille, celui-ci doit contenir au moins 2 caractères',
  }),
  email: z.string().email({
    message: 'VEuillez saisir une adresse e-mail valide',
  }),
  to: z.string().email(),
  object: z.string(),
  message: z.any(),
});

export type FormSchema = z.infer<typeof InterpellateFormSchema>;