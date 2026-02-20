import { redirect } from 'next/navigation';

import { ConfirmInterpellateSubject, getCommunityTitle, getFullName } from '#utils/emails/emailRendering';
import { renderEmailTemplate } from '#utils/emails/emailRendering-server';
import { logInterpellation } from '#utils/emails/interpellation-log';
import { trySendMail } from '#utils/emails/send-email';
import Mail from 'nodemailer/lib/mailer';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siren = searchParams.get('siren');
  const communityType = searchParams.get('communityType') ?? '';
  const communityName = searchParams.get('communityName') ?? '';
  const firstname = searchParams.get('firstname') ?? '';
  const lastname = searchParams.get('lastname') ?? '';
  const email = searchParams.get('email') ?? '';
  const emails = searchParams.get('emails') ?? '';
  const isCC = searchParams.get('isCC') === 'true';

  const confirmInterpellateHtml = renderEmailTemplate('interpellate-community', {
    communityTitle: getCommunityTitle(communityType),
    communityName: communityName,
    fullName: getFullName(firstname, lastname),
    contactEmail: process.env.MY_EMAIL ?? 'contact@eclaireurpublic.fr',
  });

  const nbContacts = emails.split(';').filter((e) => e.trim()).length;

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: emails,
    bcc: isCC ? email : undefined,
    subject: ConfirmInterpellateSubject,
    html: confirmInterpellateHtml,
  };

  const result = await trySendMail(mailOptions);

  if (result.status !== 200) {
    const body = await result.json().catch(() => ({ error: 'unknown' }));
    console.error('[interpellate/confirm] Failed to send interpellation email:', body.error);
    redirect(`/interpeller/${siren}/step3?error=send_failed`);
  }

  await logInterpellation({
    siren: siren ?? '',
    communityName,
    communityType,
    nbContacts,
    hasCopy: isCC,
  });

  redirect(`/interpeller/${siren}/step4`);
}
