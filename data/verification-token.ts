import prisma from '@/lib/db';
import { VerificationToken } from '@prisma/client';

export const getVerificationTokenByEmail = async (
    email: string
): Promise<VerificationToken | null> => {
    try {
        const verificationToken =
            await prisma.verificationToken.findFirstOrThrow({
                where: { email },
            });
        return verificationToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getVerificationTokenByToken = async (
    token: string
): Promise<VerificationToken | null> => {
    try {
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });
        return verificationToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};
