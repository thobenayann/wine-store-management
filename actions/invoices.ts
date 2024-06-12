'use server';

import prisma from '@/lib/db';
import { InvoiceStatus } from '@prisma/client';

export async function updateInvoiceStatus(
    invoiceId: string,
    status: InvoiceStatus
) {
    if (status !== 'PAID' && status !== 'PENDING') {
        throw new Error('Invalid status');
    }

    const updatedInvoice = await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status },
    });

    return updatedInvoice;
}
