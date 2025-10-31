import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siren = searchParams.get('siren');
  redirect(`/interpeller/${siren}/step4`);
}
