'use server';

import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { OrderStatus } from '@prisma/client';

export interface RecentOrder {
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: OrderStatus;
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
    const session = await getCurrentUserSession();
    if (!session || !session.user.id) {
        throw new Error('Unauthorized');
    }

    const recentOrders = await prisma.order.findMany({
        where: {
            author_id: session.user.id,
        },
        orderBy: {
            created_at: 'desc',
        },
        take: 5,
        include: {
            client: true,
            lines: true,
        },
    });

    return recentOrders.map((order) => ({
        id: order.id,
        customerName: `${order.client.first_name} ${order.client.last_name}`,
        customerEmail: order.client.email,
        totalAmount: order.lines.reduce((sum, line) => sum + line.total, 0),
        status: order.status,
    }));
}
