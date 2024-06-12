import { getPendingOrdersCount } from '@/actions/orders';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    Bell,
    Euro,
    Home,
    ShoppingCart,
    UserRoundCog,
    Users,
    Wine,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NavLink from './nav-link';

export default async function DesktopMenu() {
    let pendingOrdersCount = 0;

    try {
        pendingOrdersCount = await getPendingOrdersCount();
    } catch (error) {
        console.error('Failed to fetch pending orders count:', error);
    }

    return (
        <div className='hidden border-r bg-muted/40 md:block'>
            <div className='flex h-full max-h-screen flex-col gap-2'>
                <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
                    <Link
                        href='/dashboard'
                        className='flex items-center gap-2 font-semibold'
                    >
                        <Image
                            className='h-6 w-6'
                            src='/logos/wine-glass.svg'
                            alt='wine glass'
                            width={80}
                            height={80}
                        />
                        <span className=''>WSM</span>
                    </Link>
                    <Button
                        variant='outline'
                        size='icon'
                        className='ml-auto h-8 w-8'
                    >
                        <Bell className='h-4 w-4' />
                        <span className='sr-only'>Toggle notifications</span>
                    </Button>
                </div>
                <div className='flex-1'>
                    <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
                        <NavLink
                            href='/dashboard'
                            name='Dashboard'
                            className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                        >
                            <Home className='h-4 w-4' />
                        </NavLink>
                        <NavLink
                            href='/orders'
                            name='Commandes'
                            className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                            badge={
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Badge className='ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
                                                {pendingOrdersCount}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Nombre de commandes en attente
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            }
                        >
                            <ShoppingCart className='h-4 w-4' />
                        </NavLink>
                        <NavLink
                            href='/invoices'
                            name='Facturation'
                            className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                        >
                            <Euro className='h-4 w-4' />
                        </NavLink>
                        <NavLink
                            href='/wines'
                            name='Vins'
                            className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                        >
                            <Wine className='h-4 w-4' />
                        </NavLink>
                        <NavLink
                            href='/customers'
                            name='Clients'
                            className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                        >
                            <Users className='h-4 w-4' />
                        </NavLink>
                        <NavLink
                            href='/profile'
                            name='Profile'
                            className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                        >
                            <UserRoundCog className='h-4 w-4' />
                        </NavLink>
                    </nav>
                </div>
            </div>
        </div>
    );
}
