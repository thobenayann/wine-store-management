import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailConfig = {
    development: {
        from: 'onboarding@resend.dev',
        to: 'delivered@resend.dev',
    },
    production: {
        from: `Wine Store Management <${process.env.SERVER_MAIL}>`,
        to: process.env.ADMIN_MAIL || 'thobena.yann@gmail.com',
    },
};

const environment =
    process.env.VERCEL_ENV === 'production' ? 'production' : 'development';
const config = emailConfig[environment];

export const sendVerificationEmail = async (email: string, token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const confirmLink = `${baseUrl}/auth/verify?token=${token}`;

    try {
        const response = await resend.emails.send({
            from: config.from, // mail server (whatever you want before the @mydomain.com)
            to: email,
            subject: 'Confirmez votre adresse email',
            reply_to: config.to, // admin
            html: `
            <h1>Confirmez votre adresse email</h1>
            <p>Merci de vous être inscrit sur Wite Store Management. Cliquez sur le lien ci-dessous pour confirmer votre adresse email.</p>
            <a href="${confirmLink}">Confirmer mon adresse email</a>
        `,
        });

        return Response.json(response);
    } catch (error) {
        console.error('Error sending email:', error);
        return Response.json({ error });
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const confirmLink = `${baseUrl}/auth/new-password?token=${token}`;

    try {
        const response = await resend.emails.send({
            from: config.from, // mail server (whatever you want before the @mydomain.com)
            to: email,
            subject: 'Réinitialisez votre mot de passe',
            reply_to: config.to, // admin
            html: `
            <h1>Réinitialisez votre mot de passe</h1>
            <a href="${confirmLink}">Cliquez pour changer votre mot de passe</a>
        `,
        });

        return Response.json(response);
    } catch (error) {
        console.error('Error sending email:', error);
        return Response.json({ error });
    }
};
