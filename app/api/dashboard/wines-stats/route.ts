import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { InvoiceStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export type GetWineSalesPeriodsResponseType = Awaited<
    ReturnType<typeof getWineSalesData>
>;

export async function GET(req: NextRequest) {
    const session = await getCurrentUserSession();
    if (!session || !session.user.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = parseInt(
        searchParams.get('year') || `${new Date().getFullYear()}`
    );
    const month = searchParams.get('month')
        ? parseInt(searchParams.get('month') || '0')
        : undefined;

    const wineSales = await getWineSalesData(session.user.id, year, month);
    return NextResponse.json(wineSales);
}

async function getWineSalesData(userId: string, year: number, month?: number) {
    const where = {
        author_id: userId,
        created_at: {
            gte: new Date(year, month !== undefined ? month : 0, 1),
            lte: new Date(
                year,
                month !== undefined ? month + 1 : 12,
                month !== undefined ? 0 : 31,
                23,
                59,
                59
            ),
        },
        status: InvoiceStatus.PAID,
    };

    const invoices = await prisma.invoice.findMany({
        where,
        include: {
            lines: {
                include: {
                    wine: true,
                },
            },
        },
    });

    const wineSales = invoices.reduce(
        (acc: Record<string, { quantity: number; type: string }>, invoice) => {
            invoice.lines.forEach((line) => {
                const wineName = line.wine.name;
                const wineType = line.wine.type;
                if (!acc[wineName]) {
                    acc[wineName] = { quantity: 0, type: wineType };
                }
                acc[wineName].quantity += line.quantity;
            });
            return acc;
        },
        {}
    );

    return Object.entries(wineSales).map(([wine, data]) => ({
        wine,
        quantity: data.quantity,
        type: data.type,
    }));
}
