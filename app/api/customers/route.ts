import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return Response.json({ status: 405 });
    }
    try {
        const session = await getCurrentUserSession();
        if (!session || !session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const customers = await getCustomers();
        return Response.json(customers);
    } catch (error: any) {
        console.error(error);
        return Response.json({
            status: 500,
            message: 'Error fetching customers',
            error: error.message,
        });
    }
}

async function getCustomers() {
    const session = await getCurrentUserSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    return await prisma.customer.findMany({
        where: {
            customer_of: session.user.id,
        },
        orderBy: {
            last_name: 'desc',
        },
    });
}
