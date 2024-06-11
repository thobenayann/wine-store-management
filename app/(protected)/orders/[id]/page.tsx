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

    const handleUpdateStatus = (status: 'FULFILLED' | 'CONFIRMED') => {
        mutation.mutate({ orderId: order.id, status });
    };

    const orderDate = order.created_at
        ? formatDate(new Date(order.created_at), 'fr-FR')
        : '';

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
                                <Badge
                                    variant='outline'
                                    className={statusColor[order.status]}
                                >
                                    {translateOrderStatus(order.status)}
                                </Badge>
                            </div>
                        </div>
                    )}

                    <Table className='mt-4'>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Wine</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Availability</TableHead>
                            </TableRow>
                        </TableHeader>
                        <SkeletonWrapper isLoading={isLoading}>
                            <TableBody>
                                {order?.lines &&
                                    order.lines.map((line) => (
                                        <TableRow key={line.id}>
                                            <TableCell>
                                                {line.wine.name}
                                            </TableCell>
                                            <TableCell>
                                                {line.quantity}
                                            </TableCell>
                                            <TableCell className='max-md:min-w-24'>
                                                <span>{line.unit_price}</span>{' '}
                                                <span>€</span>
                                            </TableCell>
                                            <TableCell className='max-md:min-w-24'>
                                                {line.discount || 0} %
                                            </TableCell>
                                            <TableCell className='max-md:min-w-24'>
                                                {line.total} €
                                            </TableCell>
                                            <TableCell>
                                                {line.wine.stock}
                                            </TableCell>
                                            <TableCell>
                                                {line.wine.stock >=
                                                line.quantity ? (
                                                    <Check className='text-green-500' />
                                                ) : (
                                                    <X className='text-red-500' />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </SkeletonWrapper>
                    </Table>

                    {isOrderFulfillable ? (
                        <div className='flex flex-col space-y-2 mt-4'>
                            <div className='flex space-x-2'>
                                <p>
                                    Tous les vins de cette commande sont
                                    disponibles.
                                </p>
                                <Check
                                    className='text-green-500 md:hidden'
                                    size='60'
                                />
                            </div>
                            <Button
                                onClick={() => handleUpdateStatus('FULFILLED')}
                                className='md:w-fit'
                            >
                                Marquée comme honorée
                            </Button>
                        </div>
                    ) : (
                        <div className='flex flex-col space-y-2 mt-4'>
                            <div className='flex space-x-2'>
                                <p>
                                    Certains vins de cette commande n&apos;ont
                                    pas assez de stock pour honorer la commande.
                                </p>
                                <X
                                    className='text-red-500 md:hidden'
                                    size='80'
                                />
                            </div>
                            <Button
                                onClick={() => handleUpdateStatus('CONFIRMED')}
                                className='md:w-fit'
                            >
                                Marquée comme confirmée
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </SkeletonWrapper>
    );
}

export default OrderDetails;
