import { formSchema } from 'utils/types'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

export async function POST(request: Request) {
  const body: unknown = await request.json()

  const result = formSchema.safeParse(body)
  //   console.log('result => ', result)
  type TResultData = {
    firstname: string
    lastname: string
    email: string
    to: string[]
    object: string
    message: string
  }
  const { success, data } = result
  let firstname, lastname, email, to, object, message
  if (success && data) {
    ;({ firstname, lastname, email, to, object, message } = data)
  }
  //   const { firstname, lastname, email, to, object, message } = data
  console.log('firstname => ', firstname)

  // check out Zod's .flatten() method for an easier way to process errors
  let zodErrors = {}
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message }
    })
  }

  if (Object.keys(zodErrors).length > 0) {
    return NextResponse.json({ errors: zodErrors })
  }

  const transport = nodemailer.createTransport({
    host: 'mail.gmx.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  })

  const mailOptions: Mail.Options = {
    from: process.env.MY_EMAIL,
    to: process.env.MY_EMAIL,
    cc: process.env.CC_EMAIL_MESSAGE,
    subject: `|| ECLAIREUR PUBLIC || Message de ${firstname} ${lastname} (${email})`,
    html: message,
  }

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
