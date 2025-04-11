import { type FormSchema } from '@/components/Interpellate/types';

export async function postInterpellate(data: FormSchema) {
  return await fetch('/api/interpellate', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
