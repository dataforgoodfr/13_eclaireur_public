// TODO: Review and remove unused variables. This file ignores unused vars for now.
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';

import { InterpellateFormSchema } from '#components/Interpellate/types';
import fs from 'fs';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';

export async function POST(request: Request) {
  const body: unknown = await request.json();

  const result = InterpellateFormSchema.safeParse(body);
  const { success, data } = result;
  let firstname, lastname, email, emails, object, message, isCC, siren;
  if (success && data) {
    ({ firstname, lastname, email, emails, object, message, isCC, siren } = data);
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

  const transport = nodemailer.createTransport({
    // host: 'mail.gmx.com', // TODO effacer lors de mise en prod
    host: 'mail.gmx.com', // // config mail infomaniak
    port: 465,
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  const confirmUrl = new URL('api/interpellate/confirm', process.env.NEXT_PUBLIC_BASE_URL);
  const params = new URLSearchParams();
  params.append('siren', siren ?? '');
  params.append('isCC', isCC !== undefined ? isCC.toString() : 'false' );
  params.append('firstname', firstname ?? '');
  params.append('lastname', lastname ?? '');
  confirmUrl.search = params.toString();
  const confirmInterpellateHtml = renderEmailTemplate('confirm-interpellate', {
    firstname: firstname ?? '',
    link: confirmUrl.toString(),
  });

  const confirmInterpellateHtmlObject = `${firstname}, Confirmez votre interpellation citoyenne - Éclaireur Public`;

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL,
    // cc: isCC ? email : '',
    subject: confirmInterpellateHtmlObject,
    html: confirmInterpellateHtml,
  };

  const sendMailPromise = () =>
    new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, function (err) {
        if (!err) {
          resolve('Email sent');
        } else {
          reject(err.message);
        }
      });
    });

  try {
    await sendMailPromise();
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export function renderEmailTemplate(templateName: string, variables: Record<string, string>) {
  const filePath = path.join(process.cwd(), 'emails', `${templateName}.html`);
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace {{variable}} with the provided values
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(regex, value);
  }

  return html;
}
