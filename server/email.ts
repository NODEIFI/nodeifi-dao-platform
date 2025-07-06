import { MailService } from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

const mailService = new MailService();
if (SENDGRID_API_KEY) {
  mailService.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('⚠️ SENDGRID_API_KEY not configured - email functionality disabled');
}

interface ContactFormData {
  name: string;
  email: string;
  projectAssistance: string;
  telegram?: string;
  xTwitter?: string;
  discord?: string;
  contactPreference: 'email' | 'telegram' | 'x' | 'discord';
}

export async function sendContactFormEmail(data: ContactFormData): Promise<boolean> {
  if (!SENDGRID_API_KEY) {
    console.warn('⚠️ SendGrid not configured - skipping email send');
    return false;
  }

  try {
    // Build secondary contact info
    const secondaryContacts = [];
    if (data.telegram) secondaryContacts.push(`Telegram: ${data.telegram}`);
    if (data.xTwitter) secondaryContacts.push(`X (Twitter): ${data.xTwitter}`);
    if (data.discord) secondaryContacts.push(`Discord: ${data.discord}`);

    const contactPreferenceMap = {
      email: 'Email',
      telegram: 'Telegram',
      x: 'X (Twitter)',
      discord: 'Discord'
    };

    const emailContent = `
New Contact Form Submission from Nodeifi Website

Name: ${data.name}
Email: ${data.email}
${secondaryContacts.length > 0 ? '\nAdditional Contact Methods:\n' + secondaryContacts.join('\n') : ''}

Preferred Contact Method: ${contactPreferenceMap[data.contactPreference]}

Project Assistance Needed:
${data.projectAssistance}

---
This email was automatically generated from the Nodeifi contact form.
    `.trim();

    await mailService.send({
      to: 'hello@nodeifi.io',
      from: 'test@example.com', // Using SendGrid's default verified sender for testing
      subject: `New Contact Form Submission - ${data.name}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
      replyTo: data.email // User can reply directly to the form submitter
    });

    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    throw new Error('Failed to send email. Please try again or contact us directly.');
  }
}