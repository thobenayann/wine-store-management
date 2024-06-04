'use server';

import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { CreateCustomerSchema, CreateCustomerSchemaType } from '@/schemas';

export async function CreateCustomer(form: CreateCustomerSchemaType) {
    const parsedBody = CreateCustomerSchema.safeParse(form);

    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const session = await getCurrentUserSession();
    if (!session || !session.user.id) {
        throw new Error('Unauthorized');
    }

    const { first_name, last_name, email, phone, adresse, company } =
        parsedBody.data;

    // Vérifier si le client existe déjà pour l'utilisateur
    const existingCustomer = await prisma.customer.findFirst({
        where: {
            email,
            customer_of: session.user.id,
        },
    });
    if (existingCustomer) {
        throw new Error(
            'Un client avec cet email existe déjà pour cet utilisateur'
        );
    }

    return await prisma.customer.create({
        data: {
            first_name,
            last_name,
            email,
            phone,
            adresse,
            company,
            customer_of: session.user.id,
        },
    });
}
