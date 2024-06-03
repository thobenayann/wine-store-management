import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { NextApiRequest, NextApiResponse } from 'next';

export type GetWinesResponseType = Awaited<ReturnType<typeof getWines>>;

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return Response.json({ status: 405 });
    }
    try {
        const wines = await getWines();
        return Response.json(wines);
    } catch (error: any) {
        console.error('Error fetching wines:', error);
        return Response.json({
            status: 500,
            message: 'Error fetching wines',
            error: error.message,
        });
    }
}

export async function getWines() {
    const session = await getCurrentUserSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    return await prisma.wine.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            name: 'desc',
        },
    });
}
