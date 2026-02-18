import { NextResponse } from 'next/server';

import { FormData } from '#components/ContactForm';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export async function sendEmail(data: FormData) {
  const apiEndpoint = `api/email`;

  const sendMailRes = fetch(apiEndpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      alert(err);
    });
}

function getSmtpTransport() {
  const user = process.env.MY_EMAIL;
  const pass = process.env.MY_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      `SMTP credentials missing: MY_EMAIL=${user ? 'set' : 'MISSING'}, MY_PASSWORD=${pass ? 'set' : 'MISSING'}`,
    );
  }

  return nodemailer.createTransport({
    host: 'mail.infomaniak.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function trySendMail(mailOptions: Mail.Options) {
  try {
    const transport = getSmtpTransport();
    await transport.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[send-email] SMTP error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
