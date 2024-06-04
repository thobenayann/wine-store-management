import DeleteWineDialog from '@/components/protected/wines/delete-wine-dialog';
import UpdateWineDialog from '@/components/protected/wines/update-wine-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wine } from '@prisma/client';
import { Edit, MoreHorizontal, TrashIcon } from 'lucide-react';
import { useState } from 'react';

export default function RowActions({ wine }: { wine: Wine }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    return (
        <>
            <DeleteWineDialog
                open={showDeleteDialog}
                setOpen={setShowDeleteDialog}
                wine={wine}
            />
            <UpdateWineDialog
                open={showUpdateDialog}
                setOpen={setShowUpdateDialog}
                wine={wine}
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
                        Delete
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
