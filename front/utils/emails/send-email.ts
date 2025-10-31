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

export async function trySendMail(mailOptions: Mail.Options) {
  try {
    sendMailPromise(mailOptions);
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

async function sendMailPromise(mailOptions: Mail.Options) {
  const transport = nodemailer.createTransport({
    // host: 'mail.gmx.com', // TODO effacer lors de mise en prod
    host: 'mail.infomaniak.com', // // config mail infomaniak
    port: 465,
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });

  return new Promise<string>((resolve, reject) => {
    transport.sendMail(mailOptions, function (err) {
      if (!err) {
        resolve('Email sent');
      } else {
        reject(err.message);
      }
    });
  });
}
