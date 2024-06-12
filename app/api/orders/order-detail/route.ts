import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { NextRequest, NextResponse } from 'next/server';

export type GetOrderByIdResponseType = Awaited<ReturnType<typeof getOrderById>>;

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.method !== 'GET') {
        return Response.json({ status: 405 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('id');

    if (typeof orderId !== 'string') {
        return Response.json({
            status: 400,
            message: 'Invalid order ID provided',
        });
    }

    try {
        const order = await getOrderById(orderId);

        if (!order) {
            return Response.json({
                status: 404,
                message: 'Order not found',
            });
        }

        return Response.json(order);
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return Response.json({
            status: 500,
            message: 'Error fetching orders',
            error: error.message,
        });
    }
}

async function getOrderById(orderId: string) {
    const session = await getCurrentUserSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    return await prisma.order.findFirst({
        where: { author_id: session.user.id, id: orderId },
        include: {
            client: true,
            lines: {
                include: {
                    wine: { select: { id: true, name: true, stock: true } },
                },
            },
        },
    });
}
