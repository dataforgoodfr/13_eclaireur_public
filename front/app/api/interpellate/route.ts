import { NextResponse } from 'next/server';

import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { InterpellateFormSchema } from 'utils/types';

const HOST_ACCOUNT_ADDRESS = 'mail.gmx.com';
const HOST_ACCOUNT_EMAIL = process.env.MY_EMAIL;
const HOST_ACCOUNT_PASSWORD = process.env.MY_PASSWORD;
const HOST_ACCOUNT_EMAIL_CARBON_COPY = process.env.CC_EMAIL_MESSAGE;

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const result = InterpellateFormSchema.safeParse(body);
  const { success, data } = result;
  let firstname, lastname, email, to, object, message;
  if (success && data) {
    ({ firstname, lastname, email, to, object, message } = data);
  }
  // TODO - check out Zod's .flatten() method for an easier way to process errors
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
    host: HOST_ACCOUNT_ADDRESS,
    port: 465,
    secure: true,
    auth: {
      user: HOST_ACCOUNT_EMAIL,
      pass: HOST_ACCOUNT_PASSWORD,
    },
  });

  const mailOptions: Mail.Options = {
    from: HOST_ACCOUNT_EMAIL,
    to: HOST_ACCOUNT_EMAIL,
    cc: HOST_ACCOUNT_EMAIL_CARBON_COPY,
    subject: `|| ECLAIREUR PUBLIC || Message de ${firstname} ${lastname} (${email})`,
    html: message,
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
