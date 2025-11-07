import { redirect } from 'next/navigation';

import { ConfirmInterpellateSubject, getCommunityTitle, getFullName } from '#utils/emails/emailRendering';
import { renderEmailTemplate } from '#utils/emails/emailRendering-server';
import { trySendMail } from '#utils/emails/send-email';
import Mail from 'nodemailer/lib/mailer';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siren = searchParams.get('siren');
  const communityType = searchParams.get('communityType') ?? '';
  const communityName = searchParams.get('communityName') ?? '';
  const firstname = searchParams.get('firstname') ?? '';
  const lastname = searchParams.get('lastname') ?? '';
  // mail en CC 
  const email = searchParams.get('email') ?? '';
  // Mails à interpeller
  const emails = searchParams.get('emails') ?? '';
  const isCC = searchParams.get('isCC') === 'true';

  const confirmInterpellateHtml = renderEmailTemplate('interpellate-community', {
    communityTitle: getCommunityTitle(communityType),
    communityName: communityName,
    fullName: getFullName(firstname, lastname),
  });

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: emails,
    cc: isCC ? email : '',
    subject: ConfirmInterpellateSubject,
    html: confirmInterpellateHtml,
  };

  await trySendMail(mailOptions);

  redirect(`/interpeller/${siren}/step4`);
}
