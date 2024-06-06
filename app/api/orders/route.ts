import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.method !== 'GET') {
        return Response.json({ status: 405 });
    }

    try {
        const orders = await getOrders();
        return Response.json(orders);
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return Response.json({
            status: 500,
            message: 'Error fetching orders',
            error: error.message,
        });
    }
}

async function getOrders() {
    const session = await getCurrentUserSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    return await prisma.order.findMany({
        where: { author_id: session.user.id },
        include: {
            lines: true,
            client: true,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
}
