'use client';

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
import { useQuery } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import { useParams } from 'next/navigation';

function OrderDetails() {
    const params = useParams();
    const { id: orderId } = params;
    const { data: order, isLoading } = useQuery<GetOrderByIdResponseType>({
        queryKey: ['order-by-id'],
        queryFn: () =>
            fetch(`/api/orders/order-detail?id=${orderId}`).then((res) =>
                res.json()
            ),
        enabled: !!orderId,
    });

    if (!order) return null;

    const isOrderFulfillable = order?.lines?.every(
        (line) => line.wine.stock >= line.quantity
    );

    const handleUpdateStatus = async (status: 'FULFILLED' | 'CONFIRMED') => {
        try {
            const res = await fetch(`/api/orders/${order.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (res.ok) {
                const updatedOrder = await res.json();
                // setOrder(updatedOrder); // Assurez-vous de définir `setOrder` si nécessaire
            } else {
                console.error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
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
