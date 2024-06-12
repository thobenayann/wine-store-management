import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Invoice } from '@prisma/client';
import { MoreHorizontal, Search } from 'lucide-react';
import Link from 'next/link';

export default function RowInvoiceActions({ invoice }: { invoice: Invoice }) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} className='h-8 w-8 p-0 '>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='flex items-center gap-2 cursor-pointer'>
                        <Link
                            href={`/invoices/${invoice.id}`}
                            className='flex items-center gap-2 cursor-pointer'
                        >
                            <Search className='h-4 w-4 text-muted-foreground' />
                            Détails
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
