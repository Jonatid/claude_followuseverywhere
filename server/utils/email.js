import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  if (!process.env.EMAIL_FROM) {
    console.error('EMAIL_FROM env var is missing');
    throw new Error('EMAIL_FROM env var is missing');
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log('Email sent via Resend', result?.id || result);
    return result;
  } catch (error) {
    console.error('Error sending email via Resend', error);
    throw error;
  }
}
