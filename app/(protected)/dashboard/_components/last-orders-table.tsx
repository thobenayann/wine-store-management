import { getRecentOrders, RecentOrder } from '@/actions/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkeletonWrapper from '@/components/ui/skeleton-wrapper';
import StatusBadge from '@/components/ui/status-badge';
import { translateOrderStatus } from '@/lib/helpers';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default async function LastOrdersTable() {
    let orders: RecentOrder[] | null = null;
    let isLoading = true;

    try {
        orders = await getRecentOrders();
        isLoading = false;
    } catch (error) {
        console.error('Error fetching orders:', error);
    }

    const noOrders = !orders || orders.length === 0;

    return (
        <div className='container py-2 w-full md:w-1/2 max-md:border-t-2 max-md:border-dashed'>
            <h2 className='mt-4 md:mt-12 text-2xl max-md:text-center md:text-3xl font-bold'>
                Dernières commandes
            </h2>
            <div className='flex items-center max-md:flex-col max-md:text-center gap-x-2'>
                <p className='text-muted-foreground'>
                    Vous pouvez retrouver vos 5 dernières commandes ici
                </p>
            </div>
            <Card className='col-span-12 mt-2'>
                <CardHeader>
                    <CardTitle className='text-sm text-muted-foreground'>
                        <Link href='/orders'>
                            <Button
                                variant={'outline'}
                                size={'sm'}
                                className='ml-auto h-8 flex'
                            >
                                <ShoppingCart className='h-4 w-4' />
                            </Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <SkeletonWrapper isLoading={isLoading}>
                    <CardContent className='grid gap-8'>
                        {noOrders ? (
                            <Card className='flex max-md:text-center max-md:py-4 md:h-[300px] flex-col items-center justify-center bg-background max-md:px-4'>
                                Pas de commandes en cours
                                <p className='text-sm text-muted-foreground'>
                                    Une fois vos premières commandes saisies,
                                    elles commenceront à s&apos;afficher ici
                                </p>
                            </Card>
                        ) : (
                            orders?.map((order) => (
                                <div
                                    key={order.id}
                                    className='flex items-center justify-between gap-4'
                                >
                                    <StatusBadge status={order.status}>
                                        {translateOrderStatus(order.status)}
                                    </StatusBadge>
                                    <div className='grid gap-1'>
                                        <p className='text-sm font-medium leading-none max-md:text-xs'>
                                            {order.customerName}
                                        </p>
                                        <p className='text-sm text-muted-foreground max-md:text-xs'>
                                            {order.customerEmail}
                                        </p>
                                    </div>
                                    <div className='md:ml-auto font-medium max-md:text-sm'>
                                        {order.totalAmount.toFixed(2)}€
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </SkeletonWrapper>
            </Card>
        </div>
    );
}
