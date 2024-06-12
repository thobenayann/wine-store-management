import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { NextRequest, NextResponse } from 'next/server';

export type GetInvoiceByIdResponseType = Awaited<
    ReturnType<typeof getInvoiceById>
>;

export async function GET(req: NextRequest, res: NextResponse) {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId || typeof invoiceId !== 'string') {
        return new Response(
            JSON.stringify({ message: 'Invalid invoice ID provided' }),
            { status: 400 }
        );
    }

    try {
        const invoice = await getInvoiceById(invoiceId);

        if (!invoice) {
            return new Response(
                JSON.stringify({ message: 'Invoice not found' }),
                { status: 404 }
            );
        }

        return new Response(JSON.stringify(invoice));
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return new Response(
            JSON.stringify({ message: 'Error fetching invoice' }),
            { status: 500 }
        );
    }
}

async function getInvoiceById(invoiceId: string) {
    const session = await getCurrentUserSession();
    if (!session) {
        throw new Error('Unauthorized');
    }

    return await prisma.invoice.findFirst({
        where: { author_id: session.user.id, id: invoiceId },
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
