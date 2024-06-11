'use client';

import { updateOrderStatus } from '@/actions/orders';
import { GetOrderByIdResponseType } from '@/app/api/orders/order-detail/route';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SkeletonWrapper from '@/components/ui/skeleton-wrapper';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { statusColor } from '@/constants/orders';
import { formatDate, translateOrderStatus } from '@/lib/helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

function OrderDetails() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const { id: orderId } = params;
    const { data: order, isLoading } = useQuery<GetOrderByIdResponseType>({
        queryKey: ['order-by-id'],
        queryFn: () =>
            fetch(`/api/orders/order-detail?id=${orderId}`).then((res) =>
                res.json()
            ),
        enabled: !!orderId,
    });

    const mutation = useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: async (data) => {
            toast.success(
                `La commande est à présent marquée comme ${translateOrderStatus(
                    data.status
                )}.`,
                {
                    id: 'update-order-status',
                }
            );
            // Invalidate and refetch
            await queryClient.invalidateQueries({
                queryKey: ['order-by-id', orderId],
            });
            // Invalidate the wines related to the order
            if (order?.lines) {
                const wineIds = order.lines.map((line) => line.wine_id);
                wineIds.forEach((wineId) => {
                    queryClient.invalidateQueries({
                        queryKey: ['wine', wineId],
                    });
                });
            }
            router.push('/orders');
        },
        onError: (error: any) => {
            console.error(error);
            toast.error(
                `Echec lors de la modification du statut de la commande`,
                {
                    id: 'update-order-status-failed',
                }
            );
        },
    });

    if (!order) return null;

    const isOrderFulfillable = order?.lines?.every(
        (line) => line.wine.stock >= line.quantity
    );

    const handleUpdateStatus = (
        status: 'FULFILLED' | 'CONFIRMED' | 'INVOICED'
    ) => {
        mutation.mutate({ orderId: order.id, status });
    };

    const orderDate = order.created_at
        ? formatDate(new Date(order.created_at), 'fr-FR')
        : '';
    const totalInvoiceAmount = order.lines.reduce(
        (total, line) => total + line.total,
        0
    );

    const renderOrderDetails = () => {
        switch (order.status) {
            case 'PENDING':
                return (
                    <>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vin</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Prix unitaire</TableHead>
                                <TableHead>Remise</TableHead>
                                <TableHead>Total ligne</TableHead>
                                <TableHead>Stock courrant</TableHead>
                                <TableHead>Disponibilité</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.lines.map((line) => (
                                <TableRow key={line.id}>
                                    <TableCell>{line.wine.name}</TableCell>
                                    <TableCell>{line.quantity}</TableCell>
                                    <TableCell>{line.unit_price} €</TableCell>
                                    <TableCell>
                                        {line.discount || 0} %
                                    </TableCell>
                                    <TableCell>{line.total} €</TableCell>
                                    <TableCell>{line.wine.stock}</TableCell>
                                    <TableCell>
                                        {line.wine.stock >= line.quantity ? (
                                            <Check className='text-green-500' />
                                        ) : (
                                            <X className='text-red-500' />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className='text-right font-bold'
                                >
                                    Total à facturer :{' '}
                                    {totalInvoiceAmount.toFixed(2)} €
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </>
                );
            case 'CONFIRMED':
                return (
                    <>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vin</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Prix unitaire</TableHead>
                                <TableHead>Remise</TableHead>
                                <TableHead>Total ligne</TableHead>
                                <TableHead>Stock courrant</TableHead>
                                <TableHead>Disponibilité</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.lines.map((line) => (
                                <TableRow key={line.id}>
                                    <TableCell>{line.wine.name}</TableCell>
                                    <TableCell>{line.quantity}</TableCell>
                                    <TableCell>{line.unit_price} €</TableCell>
                                    <TableCell>
                                        {line.discount || 0} %
                                    </TableCell>
                                    <TableCell>{line.total} €</TableCell>
                                    <TableCell>{line.wine.stock}</TableCell>
                                    <TableCell>
                                        {line.wine.stock >= line.quantity ? (
                                            <Check className='text-green-500' />
                                        ) : (
                                            <X className='text-red-500' />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className='text-right font-bold'
                                >
                                    Total à facturer :{' '}
                                    {totalInvoiceAmount.toFixed(2)} €
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </>
                );
            case 'FULFILLED':
                return (
                    <>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vin</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Prix unitaire</TableHead>
                                <TableHead>Remise</TableHead>
                                <TableHead>
                                    Prix unitaire après remise
                                </TableHead>
                                <TableHead>Total ligne</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.lines.map((line) => (
                                <TableRow key={line.id}>
                                    <TableCell>{line.wine.name}</TableCell>
                                    <TableCell>{line.quantity}</TableCell>
                                    <TableCell>{line.unit_price} €</TableCell>
                                    <TableCell>
                                        {line.discount || 0} %
                                    </TableCell>
                                    <TableCell>
                                        {(
                                            line.unit_price *
                                            (1 - (line.discount || 0) / 100)
                                        ).toFixed(2)}{' '}
                                        €
                                    </TableCell>
                                    <TableCell>{line.total} €</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className='text-right font-bold'
                                >
                                    Total à facturer :{' '}
                                    {totalInvoiceAmount.toFixed(2)} €
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </>
                );
            case 'INVOICED':
                return (
                    <>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Vin</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Prix unitaire</TableHead>
                                <TableHead>Remise</TableHead>
                                <TableHead>
                                    Prix unitaire après remise
                                </TableHead>
                                <TableHead>Total ligne</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.lines.map((line) => (
                                <TableRow key={line.id}>
                                    <TableCell>{line.wine.name}</TableCell>
                                    <TableCell>{line.quantity}</TableCell>
                                    <TableCell>{line.unit_price} €</TableCell>
                                    <TableCell>
                                        {line.discount || 0} %
                                    </TableCell>
                                    <TableCell>
                                        {(
                                            line.unit_price *
                                            (1 - (line.discount || 0) / 100)
                                        ).toFixed(2)}{' '}
                                        €
                                    </TableCell>
                                    <TableCell>{line.total} €</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className='text-right font-bold'
                                >
                                    Total à facturer :{' '}
                                    {totalInvoiceAmount.toFixed(2)} €
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </>
                );
            default:
                return null;
        }
    };

    const renderOrderActions = () => {
        switch (order.status) {
            case 'PENDING':
                return isOrderFulfillable ? (
                    <div className='flex flex-col space-y-2 mt-4'>
                        <p>Tous les vins de cette commande sont disponibles.</p>
                        <Button
                            onClick={() => handleUpdateStatus('FULFILLED')}
                            className='md:w-fit'
                        >
                            Marquée comme honorée
                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-col space-y-2 mt-4'>
                        <p>
                            Certains vins de cette commande n&apos;ont pas assez
                            de stock pour honorer la commande. Vous pouvez tout
                            de même la confirmer en attendant.
                        </p>
                        <Button
                            onClick={() => handleUpdateStatus('CONFIRMED')}
                            className='md:w-fit'
                        >
                            Marquée comme confirmée
                        </Button>
                    </div>
                );
            case 'CONFIRMED':
                return isOrderFulfillable ? (
                    <div className='flex flex-col space-y-2 mt-4'>
                        <p>
                            Le stock de vin permet d&apos;honorer la commande,
                            vous pouvez la basculer en statut honorée avant de
                            pouvoir la facturer.
                        </p>
                        <Button
                            onClick={() => handleUpdateStatus('FULFILLED')}
                            className='md:w-fit'
                        >
                            Marquée comme honorée
                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-col space-y-2 mt-4'>
                        <p>
                            Le stock actuel ne permet pas encore d&apos;honorer
                            la commande.
                        </p>
                        <Button
                            onClick={() => router.push('/orders')}
                            className='md:w-fit'
                        >
                            Retour à la liste des commandes
                        </Button>
                    </div>
                );
            case 'FULFILLED':
                return (
                    <div className='flex flex-col space-y-2 mt-4'>
                        <p>La commande est honorée. Vous pouvez la facturer.</p>
                        <Button
                            onClick={() => handleUpdateStatus('INVOICED')}
                            className='md:w-fit'
                        >
                            Marquée comme facturée
                        </Button>
                    </div>
                );
            case 'INVOICED':
                return (
                    <div className='flex flex-col space-y-2 mt-4'>
                        <p>
                            Cette commande a été facturée. Vous pouvez retrouver
                            la facture correspondante portant la référence XXX.
                        </p>
                        <Button
                            onClick={() => router.push('/invoices')}
                            className='md:w-fit'
                        >
                            Liste des factures
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <SkeletonWrapper isLoading={isLoading}>
            <Card className='p-4'>
                <CardContent className='max-md:space-y-10'>
                    <h2 className='text-2xl font-bold max-md:text-center'>
                        Détail de la commande du {orderDate.toString()}
                    </h2>
                    {order?.client && (
                        <div className='mt-4'>
                            <div className='flex space-x-4'>
                                <span className='font-bold'>Client :</span>
                                <p>
                                    {order.client.first_name}{' '}
                                    {order.client.last_name}
                                </p>
                            </div>
                            <div className='flex space-x-2'>
                                <p>Status :</p>
                                {order.status ? (
                                    <Badge
                                        variant='outline'
                                        className={statusColor[order.status]}
                                    >
                                        {translateOrderStatus(order.status)}
                                    </Badge>
                                ) : null}
                            </div>
                        </div>
                    )}

                    <Table className='mt-4'>{renderOrderDetails()}</Table>

                    {renderOrderActions()}
                </CardContent>
            </Card>
        </SkeletonWrapper>
    );
}

export default OrderDetails;
