'use server';

import prisma from '@/lib/db';
import { UserSettingsFormValues, userSettingsSchema } from '@/schemas';

export type GetUserSettings = Awaited<ReturnType<typeof getUserSettings>>;

export async function getUserSettings(userId: string) {
    try {
        const settings = await prisma.userSettings.findUnique({
            where: { user_id: userId },
        });
        return settings;
    } catch (error) {
        console.error('Failed to fetch user settings:', error);
        return null;
    }
}

export async function updateUserSettings(
    data: UserSettingsFormValues,
    userId: string
) {
    const parsedData = userSettingsSchema.safeParse(data);

    if (!parsedData.success) {
        return { error: 'Invalid data', details: parsedData.error.flatten() };
    }

    try {
        await prisma.userSettings.update({
            where: { user_id: userId },
            data: parsedData.data,
        });
        return { success: 'User settings updated successfully.' };
    } catch (error) {
        console.error('Failed to update user settings:', error);
        return { error: 'Failed to update user settings.' };
    }
}
