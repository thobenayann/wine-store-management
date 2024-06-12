import prisma from '@/lib/db';
import { getCurrentUserSession } from '@/lib/getSession';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getCurrentUserSession();
    if (!session || !session.user.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const periods = await getHistoryPeriods(session.user.id);
    return NextResponse.json(periods);
}

export type GetHistoryPeriodsResponseType = Awaited<
    ReturnType<typeof getHistoryPeriods>
>;

async function getHistoryPeriods(userId: string) {
    const result = await prisma.invoice.findMany({
        where: {
            author_id: userId,
        },
        select: {
            created_at: true,
        },
        distinct: ['created_at'],
        orderBy: {
            created_at: 'asc',
        },
    });

    const years = result.map((el) => new Date(el.created_at).getFullYear());
    if (years.length === 0) {
        return [new Date().getFullYear()];
    }

    return Array.from(new Set(years));
}
