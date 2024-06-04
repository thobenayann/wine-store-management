'use server';

import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import {
    CreateWineSchema,
    CreateWineSchemaType,
    DeleteWineSchema,
    DeleteWineSchemaType,
    UpdateWineSchemaType,
} from '@/schemas';

// CREATE WINE
export async function CreateWine(form: CreateWineSchemaType) {
    const parsedBody = CreateWineSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const session = await getCurrentUserSession();
    if (!session || !session.user.id) {
        throw new Error('Unauthorized');
    }

    const { name, type, region, year, price, stock, stock_alert } =
        parsedBody.data;

    // Vérifier si le vin existe déjà pour l'utilisateur
    const existingWine = await prisma.wine.findFirst({
        where: {
            name,
            userId: session.user.id,
        },
    });
    if (existingWine) {
        throw new Error(
            'Un vin avec ce nom existe déjà pour cet utilisateur 🤷'
        );
    }

    return await prisma.wine.create({
        data: {
            name,
            type,
            region,
            year,
            price,
            stock,
            stock_alert,
            userId: session.user.id,
        },
    });
}

// DELETE WINE
export async function DeleteWine(form: DeleteWineSchemaType) {
    const parsedBody = DeleteWineSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const session = await getCurrentUserSession();
    if (!session || !session.user.id) {
        throw new Error('Unauthorized');
    }

    const { id } = parsedBody.data;

    // Check if the wine exists and belongs to the user
    const wine = await prisma.wine.findUnique({
        where: { id },
    });

    if (!wine || wine.userId !== session.user.id) {
        throw new Error('Unauthorized or wine not found');
    }

    return await prisma.wine.delete({
        where: {
            id,
        },
    });
}

// UPDATE WINE
export async function updateWineAction(
    wine: UpdateWineSchemaType,
    wineId: string,
    userId: string
) {
    const session = await getCurrentUserSession();
    if (!session || session.user.id !== userId) {
        throw new Error('Unauthorized');
    }

    const updatedWine = await prisma.wine.update({
        where: { id: wineId },
        data: {
            ...wine,
        },
    });

    return updatedWine;
}
