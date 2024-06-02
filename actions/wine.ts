'use server';

import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import {
    CreateWineSchema,
    CreateWineSchemaType,
    DeleteWineSchema,
    DeleteWineSchemaType,
} from '@/schemas';

export async function CreateWine(form: CreateWineSchemaType) {
    const parsedBody = CreateWineSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const session = await getCurrentUserSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    const { name, type, region, year, price, stock, stock_alert } =
        parsedBody.data;
    return await prisma.wine.create({
        data: {
            name,
            type,
            region,
            year,
            price,
            stock,
            stock_alert,
        },
    });
}

export async function DeleteWine(form: DeleteWineSchemaType) {
    const parsedBody = DeleteWineSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const { id } = parsedBody.data;
    return await prisma.wine.delete({
        where: {
            id,
        },
    });
}
