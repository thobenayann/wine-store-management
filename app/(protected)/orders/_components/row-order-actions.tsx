import DeleteOrderDialog from '@/components/protected/orders/delete-order-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Order } from '@/schemas';
import { MoreHorizontal, Search, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RowOrderActions({ order }: { order: Order }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DeleteOrderDialog
                open={showDeleteDialog}
                setOpen={setShowDeleteDialog}
                order={order}
            />
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
                    <DropdownMenuItem
                        className='flex items-center gap-2 cursor-pointer'
                        onSelect={() => {
                            setShowDeleteDialog((prev) => !prev);
                        }}
                    >
                        <TrashIcon className='h-4 w-4 text-muted-foreground' />
                        Supprimer
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className='flex items-center gap-2 cursor-pointer'
                        onSelect={() => {
                            setShowDeleteDialog((prev) => !prev);
                        }}
                    >
                        <Link
                            href={`/orders/${order.id}`}
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
