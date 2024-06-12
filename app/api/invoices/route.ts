import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { NextRequest, NextResponse } from 'next/server';

export type GetInvoicesResponseType = Awaited<ReturnType<typeof getInvoices>>;

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.method !== 'GET') {
        return Response.json({ status: 405 });
    }

    try {
        const invoices = await getInvoices();
        return Response.json(invoices);
    } catch (error: any) {
        console.error('Error fetching invoices:', error);
        return Response.json({
            status: 500,
            message: 'Error fetching invoices',
            error: error.message,
        });
    }
}

async function getInvoices() {
    const session = await getCurrentUserSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    const invoices = await prisma.invoice.findMany({
        where: {
            author_id: session.user.id,
        },
        include: {
            client: true,
            lines: true,
        },
        orderBy: {
            created_at: 'desc',
        },
    });

    return invoices.map((invoice) => ({
        ...invoice,
        total: invoice.lines.reduce((sum, line) => sum + line.total, 0),
    }));
}
