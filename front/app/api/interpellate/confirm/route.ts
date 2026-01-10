import { redirect } from 'next/navigation';

import {
  ConfirmInterpellateSubject,
  getCommunityTitle,
  getFullName,
} from '#utils/emails/emailRendering';
import { renderEmailTemplate } from '#utils/emails/emailRendering-server';
import { verifyInterpellateToken } from '#utils/emails/interpellateToken';
import { trySendMail } from '#utils/emails/send-email';
import Mail from 'nodemailer/lib/mailer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    redirect('/interpeller/error');
  }

  const payload = verifyInterpellateToken(token);

  if (!payload) {
    redirect('/interpeller/error');
  }

  const { siren, communityType, communityName, firstname, lastname, email, emails, isCC } =
    payload;

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
