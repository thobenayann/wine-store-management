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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser)
        return { error: 'Cette adresse email est déjà utilisée.' };

    // Create user
    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
        },
    });

    // Send verification token email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    );

    return { success: 'Email de confirmation envoyé.' };
};
