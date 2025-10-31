import { renderEmailTemplate } from '#utils/emails/emailRendering-server';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siren = searchParams.get('siren');

  // const confirmInterpellateHtml = renderEmailTemplate('confirm-interpellate', {
  //   communityTitle: getCommunityTitle(communityType),
  //   communityName: communityName,
  //   fullName: getFullName(firstName, lastName)
  // });


  redirect(`/interpeller/${siren}/step4`);
}
