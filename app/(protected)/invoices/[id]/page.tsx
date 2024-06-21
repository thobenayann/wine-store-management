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
import {
    formatCurrency,
    formatDate,
    translateInvoiceStatus,
} from '@/lib/helpers';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import InvoicePDF from '../_components/invoice-pdf';

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

    const totalHT = invoice.lines.reduce(
        (total, line) =>
            total +
            line.unit_price * line.quantity * (1 - (line.discount || 0) / 100),
        0
    );

    const vatAmount =
        totalHT * (invoice.vat_applied ? invoice.vat_applied / 100 : 0);
    const totalTTC = totalHT + vatAmount;

    const renderInvoiceDetails = () => (
        <>
            <TableHeader>
                <TableRow>
                    <TableHead>Vin</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Prix unitaire HT</TableHead>
                    <TableHead>Remise</TableHead>
                    <TableHead>Prix unitaire après remise</TableHead>
                    <TableHead>Total ligne HT</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoice.lines.map((line) => (
                    <TableRow key={line.id}>
                        <TableCell>{line.wine.name}</TableCell>
                        <TableCell>{line.quantity}</TableCell>
                        <TableCell>{formatCurrency(line.unit_price)}</TableCell>
                        <TableCell>{line.discount || 0} %</TableCell>
                        <TableCell>
                            {formatCurrency(
                                line.unit_price *
                                    (1 - (line.discount || 0) / 100)
                            )}
                        </TableCell>
                        <TableCell>
                            {formatCurrency(
                                line.unit_price *
                                    line.quantity *
                                    (1 - (line.discount || 0) / 100)
                            )}
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <TableCell colSpan={6} className='text-right'>
                        Total HT facturé :{' '}
                        <span className='font-bold'>
                            {formatCurrency(totalHT)}
                        </span>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={6} className='text-right'>
                        TVA ({invoice.vat_applied}%) :{' '}
                        <span className='font-bold'>
                            {formatCurrency(vatAmount)}
                        </span>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={6} className='text-right'>
                        Total TTC :{' '}
                        <span className='font-bold'>
                            {formatCurrency(totalTTC)}
                        </span>
                    </TableCell>
                </TableRow>
            </TableBody>
        </>
    );

    return (
        <SkeletonWrapper isLoading={isLoading}>
            <Card className='p-4'>
                <CardContent className='max-md:space-y-10'>
                    <div className='flex md:justify-between max-md:flex-col max-md:items-center max-md:space-y-4'>
                        <div>
                            <h2 className='text-2xl font-bold max-md:text-center'>
                                Détail de la facture du {invoiceDate}
                            </h2>
                            {invoice?.client && (
                                <div className='flex flex-col space-y-2 mt-4'>
                                    <div className='flex space-x-4'>
                                        <span className='font-bold'>
                                            Client :
                                        </span>
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
                                            <StatusBadge
                                                status={invoice.status}
                                            >
                                                {translateInvoiceStatus(
                                                    invoice.status
                                                )}
                                            </StatusBadge>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <PDFDownloadLink
                                document={<InvoicePDF invoice={invoice} />}
                                fileName={`facture_${invoice.id}.pdf`}
                                className='btn btn-primary'
                            >
                                {({ loading }) =>
                                    loading ? (
                                        'Création du PDF...'
                                    ) : (
                                        <div className='flex flex-col items-center border-2 border-dashed rounded-2xl p-4 space-y-1 dark:hover:bg-gray-900 hover:bg-gray-200'>
                                            <p>Télécharger le PDF</p>
                                            <Image
                                                src='/gif/system-upload-file.gif'
                                                alt='wine gif'
                                                width={50}
                                                height={50}
                                                unoptimized
                                            />
                                        </div>
                                    )
                                }
                            </PDFDownloadLink>
                        </div>
                    </div>
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
