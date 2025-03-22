import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

// export async function POST(request: NextRequest, response: NextResponse) {
export async function POST(request: NextRequest) {
  try {
    const res = await request.json()
    const { email, name, message } = res

    if (
      !email ||
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !message ||
      message.trim() === ''
    ) {
      const newResponse = new NextResponse(
        JSON.stringify({ error: 'invalid input !' }),
        {
          status: 422,
        }
      )
      return newResponse
    }
    // res.status(201).json({ message: 'Message envoyé!' })
    const newResponse = new NextResponse(JSON.stringify(res), {
      status: 201,
    })
    // console.log('success response => ', newResponse)

    const transport = nodemailer.createTransport({
      // service: 'gmail',
      host: 'mail.gmx.com',
      // port: 587,
      // secure: false,
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
      subject: `|| ECLAIREUR PUBLIC || Message de ${name} (${email})`,
      text: message,
    }

    const sendMailPromise = () =>
      new Promise<string>((resolve, reject) => {
        transport.sendMail(mailOptions, function (err) {
          if (!err) {
            resolve('Email sent')
          } else {
            reject(err.message)
          }
        })
      })

    try {
      await sendMailPromise()
      return NextResponse.json({ message: 'Email sent' })
    } catch (err) {
      return NextResponse.json({ error: err }, { status: 500 })
    }
    // return newResponse
  } catch (error) {
    // console.log('catch error branch')
    return new NextResponse(
      JSON.stringify({ error: 'Error processing request' }),
      {
        status: 500,
      }
    )
  }
}