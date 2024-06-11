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

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
            lines: true,
            client: true,
        },
    });

    if (!order || order.author_id !== session.user.id) {
        throw new Error('Unauthorized or order not found');
    }

    switch (status) {
        case 'FULFILLED':
            // Update the order status and decrement the wine stock
            return await prisma.$transaction(async (prisma) => {
                const updatedOrder = await prisma.order.update({
                    where: { id: orderId },
                    data: { status },
                    include: { lines: true },
                });

                const stockUpdates = updatedOrder.lines.map((line) =>
                    prisma.wine.update({
                        where: { id: line.wine_id },
                        data: { stock: { decrement: line.quantity } },
                    })
                );

                await Promise.all(stockUpdates);
                return updatedOrder;
            });

        case 'INVOICED':
            if (order.status !== 'FULFILLED') {
                throw new Error('Only fulfilled orders can be invoiced');
            }

            const authorId = session.user.id;
            if (!authorId) {
                throw new Error('Author ID is required');
            }

            return await prisma.$transaction(async (prisma) => {
                // Create an invoice
                const invoice = await prisma.invoice.create({
                    data: {
                        reference: `INV-${order.id}`,
                        due_date: new Date(
                            new Date().setDate(new Date().getDate() + 30)
                        ), // Due date set to 30 days from now
                        status: 'PENDING',
                        author_id: authorId,
                        client_id: order.client_id,
                        lines: {
                            create: order.lines.map((line) => ({
                                wine_id: line.wine_id,
                                quantity: line.quantity,
                                unit_price: line.unit_price,
                                total: line.total,
                                discount: line.discount,
                            })),
                        },
                    },
                });

                // Update the order status to INVOICED
                const updatedOrder = await prisma.order.update({
                    where: { id: orderId },
                    data: { status },
                });

                return updatedOrder;
            });

        default:
            // Update the order status only
            return await prisma.order.update({
                where: { id: orderId },
                data: { status },
            });
    }
}
