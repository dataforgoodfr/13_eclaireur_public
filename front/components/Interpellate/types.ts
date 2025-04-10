import { z } from 'zod';

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
  emails: z.string().email(),
  object: z.string(),
  message: z.any(),
});

export type FormSchema = z.infer<typeof InterpellateFormSchema>;
