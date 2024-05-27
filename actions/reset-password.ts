'use server';

import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ResetPasswordSchema } from '@/schemas';
import { z } from 'zod';

export const resetPassword = async (
    values: z.infer<typeof ResetPasswordSchema>
) => {
    const validateFields = ResetPasswordSchema.safeParse(values);

    if (!validateFields.success) {
        return {
            error: 'Mail invalide',
        };
    }

    const { email } = validateFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return {
            error: 'Aucun utilisateur trouvé',
        };
    }

    // reset password
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    );

    return {
        success: 'Email de réinitialisation envoyé!',
    };
};
