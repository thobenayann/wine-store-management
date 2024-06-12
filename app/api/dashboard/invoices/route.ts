import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { InvoiceStatusType } from '@/types/chart';
import { getDaysInMonth } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const getInvoicesSchema = z.object({
    timeframe: z.enum(['month', 'year']),
    year: z.coerce.number().min(2000).max(3000),
    month: z.coerce.number().min(0).max(11).optional().nullable(),
});

export async function GET(req: NextRequest) {
    const session = await getCurrentUserSession();
    if (!session || !session.user.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    console.log('timeframe', timeframe);
    console.log('year', year);
    console.log('month', month);

    const queryParams = getInvoicesSchema.safeParse({
        timeframe,
        year,
        month: month ? parseInt(month) : undefined,
    });

    if (!queryParams.success) {
        return new NextResponse(queryParams.error.message, { status: 400 });
    }

    const data = await getInvoicesData(
        session.user.id,
        queryParams.data.timeframe,
        queryParams.data.year,
        queryParams.data.month ?? undefined
    );

    return NextResponse.json(data);
}

interface InvoiceLine {
    total: number;
}

interface Invoice {
    created_at: Date;
    status: InvoiceStatusType;
    lines: InvoiceLine[];
}

interface HistoryData {
    date: string;
    PAID: number;
    PENDING: number;
}

async function getInvoicesData(
    userId: string,
    timeframe: 'month' | 'year',
    year: number,
    month?: number
): Promise<HistoryData[]> {
    const where = {
        author_id: userId,
        created_at: {
            gte: new Date(year, month !== undefined ? month : 0, 1),
            lte: new Date(year, month !== undefined ? month + 1 : 12, 0),
        },
    };

    const invoices = await prisma.invoice.findMany({
        where,
        include: {
            lines: true,
        },
    });

    // Filtrer les factures pour inclure uniquement celles avec les statuts attendus
    const filteredInvoices: Invoice[] = invoices.filter((invoice) =>
        ['PAID', 'PENDING'].includes(invoice.status)
    ) as Invoice[];

    if (timeframe === 'year') {
        return getYearInvoices(year, filteredInvoices);
    } else {
        return getMonthInvoices(year, month!, filteredInvoices);
    }
}

function getYearInvoices(year: number, invoices: Invoice[]): HistoryData[] {
    const history: HistoryData[] = Array.from({ length: 12 }, (_, i) => ({
        date: new Date(year, i, 1).toISOString(),
        PAID: 0,
        PENDING: 0,
    }));

    invoices.forEach((invoice) => {
        const month = new Date(invoice.created_at).getMonth();
        if (invoice.status === 'PAID') {
            history[month].PAID += invoice.lines.reduce(
                (sum: number, line: InvoiceLine) => sum + line.total,
                0
            );
        } else if (invoice.status === 'PENDING') {
            history[month].PENDING += invoice.lines.reduce(
                (sum: number, line: InvoiceLine) => sum + line.total,
                0
            );
        }
    });

    return history;
}

function getMonthInvoices(
    year: number,
    month: number,
    invoices: Invoice[]
): HistoryData[] {
    const daysInMonth = getDaysInMonth(new Date(year, month));
    const history: HistoryData[] = Array.from(
        { length: daysInMonth },
        (_, i) => ({
            date: new Date(year, month, i + 1).toISOString(),
            PAID: 0,
            PENDING: 0,
        })
    );

    invoices.forEach((invoice) => {
        const day = new Date(invoice.created_at).getDate() - 1;
        if (invoice.status === 'PAID') {
            history[day].PAID += invoice.lines.reduce(
                (sum: number, line: InvoiceLine) => sum + line.total,
                0
            );
        } else if (invoice.status === 'PENDING') {
            history[day].PENDING += invoice.lines.reduce(
                (sum: number, line: InvoiceLine) => sum + line.total,
                0
            );
        }
    });

    return history;
}
