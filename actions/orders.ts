'use server';

import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import {
    CreateOrderSchemaType,
    DeleteOrderSchema,
    DeleteOrderSchemaType,
    UpdateOrderStatusSchemaType,
} from '@/schemas';
import { Order } from '@prisma/client';

export async function CreateOrder(data: CreateOrderSchemaType) {
    const session = await getCurrentUserSession();
    if (!session || !session.user.id) {
        throw new Error('Unauthorized');
    }

    // Verify client exists
    const client = await prisma.customer.findUnique({
        where: { id: data.client_id },
    });
    if (!client) {
        throw new Error('Client not found');
    }

    // Prepare order lines
    const orderLines = [];
    for (const line of data.lines) {
        const wine = await prisma.wine.findUnique({
            where: { id: line.wine_id },
        });
        if (!wine) {
            throw new Error(`Wine with ID ${line.wine_id} not found`);
        }
        if (wine.stock < line.quantity) {
            throw new Error(`Insufficient stock for wine ${wine.name}`);
        }
        // Update wine stock
        await prisma.wine.update({
            where: { id: line.wine_id },
            data: { stock: { decrement: line.quantity } },
        });
        orderLines.push({
            wine_id: line.wine_id,
            quantity: line.quantity,
            unit_price: line.unit_price,
            total:
                line.quantity *
                line.unit_price *
                (1 - (line.discount || 0) / 100),
            discount: line.discount,
        });
    }

    // Create order
    const order = await prisma.order.create({
        data: {
            client_id: data.client_id,
            author_id: session.user.id,
            status: 'PENDING',
            lines: {
                create: orderLines,
            },
        },
        include: {
            lines: true,
        },
    });

    return order;
}

// DELETE ORDER
export async function DeleteOrder(form: DeleteOrderSchemaType) {
    const parsedBody = DeleteOrderSchema.safeParse(form);
    if (!parsedBody.success) {
        throw new Error('Bad request');
    }

    const session = await getCurrentUserSession();
    if (!session || !session.user.id) {
        throw new Error('Unauthorized');
    }

    const { id } = parsedBody.data;

    // Check if the order exists and belongs to the user
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            lines: true,
        },
    });

    if (!order || order.author_id !== session.user.id) {
        throw new Error('Unauthorized or order not found');
    }

    // If the order is fulfilled, increment the stock of the wines
    if (order.status === 'FULFILLED') {
        const updateStockPromises = order.lines.map((line) =>
            prisma.wine.update({
                where: { id: line.wine_id },
                data: {
                    stock: {
                        increment: line.quantity,
                    },
                },
            })
        );

        await Promise.all(updateStockPromises);
    }

    // Delete the order
    return await prisma.order.delete({
        where: { id },
    });
}

// UPDATE ORDER STATUS
export async function updateOrderStatus({
    orderId,
    status,
}: UpdateOrderStatusSchemaType): Promise<Order> {
    const session = await getCurrentUserSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    if (status === 'FULFILLED') {
        const order = await prisma.$transaction(async (prisma) => {
            const order = await prisma.order.update({
                where: { id: orderId },
                data: { status },
                include: { lines: true },
            });

            // Update the stock of each wine in the order
            const stockUpdates = order.lines.map((line) => {
                return prisma.wine.update({
                    where: { id: line.wine_id },
                    data: { stock: { decrement: line.quantity } },
                });
            });

            // Execute all stock updates in parallel
            await Promise.all(stockUpdates);

            return order;
        });

        return order;
    } else {
        // Update the order status only
        return await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
    }
}
