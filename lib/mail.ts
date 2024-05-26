import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const confirmLink = `${baseUrl}/auth/verify?token=${token}`;

    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Confirmez votre adresse email',
        html: `
            <h1>Confirmez votre adresse email</h1>
            <p>Merci de vous être inscrit sur Resend. Cliquez sur le lien ci-dessous pour confirmer votre adresse email.</p>
            <a href="${confirmLink}">Confirmer mon adresse email</a>
        `,
    });
};
