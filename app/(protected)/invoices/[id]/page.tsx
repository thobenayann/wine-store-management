'use client';

import { GetInvoiceByIdResponseType } from '@/app/api/invoices/invoice-detail/route';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SkeletonWrapper from '@/components/ui/skeleton-wrapper';
import StatusBadge from '@/components/ui/status-badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, translateInvoiceStatus } from '@/lib/helpers';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

function InvoiceDetails() {
    const router = useRouter();
    const params = useParams();
    const { id: invoiceId } = params;
    const { data: invoice, isLoading } = useQuery<GetInvoiceByIdResponseType>({
        queryKey: ['invoice-by-id', invoiceId],
        queryFn: () =>
            fetch(`/api/invoices/invoice-detail?id=${invoiceId}`).then((res) =>
                res.json()
            ),
        enabled: !!invoiceId,
    });

    if (!invoice) return null;

    const invoiceDate = invoice.created_at
        ? formatDate(new Date(invoice.created_at), 'fr-FR')
        : '';
    const dueDate = invoice.due_date
        ? formatDate(new Date(invoice.due_date), 'fr-FR')
        : '';
    const totalInvoiceAmount = invoice.lines.reduce(
        (total, line) => total + line.total,
        0
    );

    const renderInvoiceDetails = () => (
        <>
            <TableHeader>
                <TableRow>
                    <TableHead>Vin</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Prix unitaire</TableHead>
                    <TableHead>Remise</TableHead>
                    <TableHead>Total ligne</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoice.lines.map((line) => (
                    <TableRow key={line.id}>
                        <TableCell>{line.wine.name}</TableCell>
                        <TableCell>{line.quantity}</TableCell>
                        <TableCell>{line.unit_price} €</TableCell>
                        <TableCell>{line.discount || 0} %</TableCell>
                        <TableCell>{line.total} €</TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell colSpan={5} className='text-right font-bold'>
                        Total : {totalInvoiceAmount.toFixed(2)} €
                    </TableCell>
                </TableRow>
            </TableBody>
        </>
    );

    return (
        <SkeletonWrapper isLoading={isLoading}>
            <Card className='p-4'>
                <CardContent className='max-md:space-y-10'>
                    <h2 className='text-2xl font-bold max-md:text-center'>
                        Détail de la facture du {invoiceDate}
                    </h2>
                    {invoice?.client && (
                        <div className='flex flex-col space-y-2 mt-4'>
                            <div className='flex space-x-4'>
                                <span className='font-bold'>Client :</span>
                                <p>
                                    {invoice.client.first_name}{' '}
                                    {invoice.client.last_name}
                                </p>
                            </div>
                            <div className='flex space-x-2'>
                                <p>Échéance :</p>
                                <p>{dueDate}</p>
                            </div>
                            <div className='flex space-x-2'>
                                <p>Status :</p>
                                {invoice.status ? (
                                    <StatusBadge status={invoice.status}>
                                        {translateInvoiceStatus(invoice.status)}
                                    </StatusBadge>
                                ) : null}
                            </div>
                        </div>
                    )}
                    <Table className='mt-4'>{renderInvoiceDetails()}</Table>
                    <div className='flex flex-col space-y-2 mt-4'>
                        <Button
                            onClick={() => router.push('/invoices')}
                            className='md:w-fit'
                        >
                            Liste des factures
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </SkeletonWrapper>
    );
}

export default InvoiceDetails;
