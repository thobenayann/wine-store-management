import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) {
    if (req.method !== 'GET') {
        return Response.json({ status: 405 });
    }

    const session = await getCurrentUserSession();
    if (!session) {
        return Response.json({ status: 401 });
    }

    try {
        const wines = await prisma.wine.findMany({
            where: {
                userId: session.user.id,
            },
        });
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
