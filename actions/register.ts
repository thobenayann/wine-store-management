'use server';

import prisma from '@/lib/db';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { RegisterSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: 'Invalid fields',
        };
    }

    const { email, password, firstName, lastName } = values;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'Cette adresse email est déjà utilisée.' };
        }

        // Start a transaction
        const user = await prisma.$transaction(async (prisma) => {
            // Create user with default userSettings
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    first_name: firstName,
                    last_name: lastName,
                },
            });

            // Create user settings
            await prisma.userSettings.create({
                data: {
                    user_id: newUser.id,
                    // No need to specify vat_rate, payment_terms, or currency since they have defaults
                },
            });

            // Send verification token email
            const verificationToken = await generateVerificationToken(email);
            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token
            );

            return newUser;
        });

        return { success: 'Email de confirmation envoyé.' };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { error: 'An unexpected error occurred.' };
    }
};
