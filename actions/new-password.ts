'use server';

import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import prisma from '@/lib/db';
import { NewPasswordSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    if (!token) {
        return { error: 'Un token est requis.' };
    }

    const validateFields = NewPasswordSchema.safeParse(values);
    if (!validateFields.success) {
        return { error: 'Champ invalide' };
    }

    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
        return { error: 'Token invalide' };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { error: 'Token expiré' };
    }

    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { error: 'Utilisateur introuvable' };
    }

    // Manage new password
    const { password } = validateFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            password: hashedPassword,
        },
    });

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id },
    });

    return { success: 'Mot de passe mis à jour!' };
};
