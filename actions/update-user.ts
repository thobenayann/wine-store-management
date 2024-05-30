'use server';

import prisma from '@/lib/db';
import { accountFormSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

type UpdateUserResult = {
    success?: string;
    error?: string;
};

export const updateUser = async (
    formData: FormData,
    userId: string
): Promise<UpdateUserResult> => {
    const rawFormData = Object.fromEntries(formData);
    const validatedFields = accountFormSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return { error: 'Invalid fields' };
    }

    const { firstName, lastName, email, password } = validatedFields.data;
    const imageFile = formData.get('image') as File | null;

    try {
        // Check if email is already taken (except for the current user's email)
        const emailExists = await prisma.user.findFirst({
            where: {
                email: email,
                id: { not: userId },
            },
        });

        if (emailExists) {
            return { error: 'Cette adresse email est déjà prise.' };
        }

        // manage image upload
        let imageUrl: string | undefined = undefined;
        if (imageFile) {
            const imagePath = path.join(
                process.cwd(),
                'public',
                'profiles',
                userId
            );
            await fs.mkdir(imagePath, { recursive: true });
            const imageExtension = path.extname(imageFile.name);
            const imagePathFull = path.join(
                imagePath,
                `profile${imageExtension}`
            );
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await fs.writeFile(imagePathFull, buffer);
            imageUrl = `/profiles/${userId}/profile${imageExtension}`;
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password
                    ? await bcrypt.hash(password, 10)
                    : undefined,
                image: imageUrl,
            },
        });

        return { success: 'User updated successfully' };
    } catch (error) {
        return { error: 'Failed to update user' };
    }
};
