import { NextResponse } from 'next/server';

import { InterpellateFormSchema } from '#components/Interpellate/types';
import { renderEmailTemplate } from '#utils/emails/emailRendering-server';
import { createInterpellateToken } from '#utils/emails/interpellateToken';
import { trySendMail } from '#utils/emails/send-email';
import Mail from 'nodemailer/lib/mailer';

export async function POST(request: Request) {
  const body: unknown = await request.json();

  const result = InterpellateFormSchema.safeParse(body);
  const { success, data } = result;
  let firstname,
    lastname,
    communityName,
    communityType,
    email,
    emails,
    isCC,
    siren;
  if (success && data) {
    ({
      firstname,
      lastname,
      communityName,
      communityType,
      email,
      emails,
      isCC,
      siren,
    } = data);
  }

  // check out Zod's .flatten() method for an easier way to process errors
  let zodErrors = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
  }

  if (Object.keys(zodErrors).length > 0) {
    return NextResponse.json({ errors: zodErrors });
  }

  const token = createInterpellateToken({
    siren: siren ?? '',
    firstname: firstname ?? '',
    lastname: lastname ?? '',
    email: email ?? '',
    emails: emails ?? '',
    isCC: isCC ?? false,
    communityType: communityType ?? '',
    communityName: communityName ?? '',
  });
  const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/interpellate/confirm?token=${token}`;
  const confirmInterpellateHtml = renderEmailTemplate('confirm-interpellate', {
    firstname: firstname ?? '',
    link: confirmUrl,
  });

  const confirmInterpellateHtmlObject = `${firstname}, Confirmez votre interpellation citoyenne - Éclaireur Public`;

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: confirmInterpellateHtmlObject,
    html: confirmInterpellateHtml,
  };

  return trySendMail(mailOptions);
}
