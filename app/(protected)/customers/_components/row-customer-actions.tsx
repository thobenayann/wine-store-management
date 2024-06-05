// import UpdateCustomerDialog from './update-customer-dialog';
import DeleteCustomerDialog from '@/components/protected/customers/delete-customer.dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Customer } from '@prisma/client';
import { Edit, MoreHorizontal, TrashIcon } from 'lucide-react';
import { useState } from 'react';

interface RowCustomerActionsProps {
    customer: Partial<Customer>;
}

export default function RowCustomerActions({
    customer,
}: RowCustomerActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    return (
        <>
            <DeleteCustomerDialog
                open={showDeleteDialog}
                setOpen={setShowDeleteDialog}
                customer={customer}
            />
            {/* <UpdateCustomerDialog
                open={showUpdateDialog}
                setOpen={setShowUpdateDialog}
                customer={customer}
            /> */}
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
                            setShowUpdateDialog((prev) => !prev);
                        }}
                    >
                        <Edit className='h-4 w-4 text-muted-foreground' />
                        Modifier
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
