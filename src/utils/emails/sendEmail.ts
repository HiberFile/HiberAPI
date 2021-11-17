import nodemailer from 'nodemailer';

export default async (emailAddress: string, email: { subject: string, html: string }) => {
  if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PW,
      },
    });

    await transporter.sendMail({
      from: '"HiberFile" <hiberfile@hiberfile.com>',
      to: emailAddress,
      subject: email.subject,
      html: email.html,
    });
  }
}
