'use client';

import { DeleteCustomer } from '@/actions/customers';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Customer } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    customer: Partial<Customer>;
}

function DeleteCustomerDialog({ customer, setOpen, open }: Props) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: DeleteCustomer,
        onSuccess: async () => {
            toast.success(
                `Le client ${customer.first_name} ${customer.last_name} a été supprimé! 🎉`,
                {
                    id: 'delete-customer',
                }
            );

            await queryClient.invalidateQueries({
                queryKey: ['customers'],
            });
        },
        onError: () => {
            toast.error(`Echec lors de la suppression du client`, {
                id: 'delete-customer',
            });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela supprimera
                        définitivement le client {customer.first_name}{' '}
                        {customer.last_name}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (customer.id) {
                                mutate({ id: customer.id });
                            }
                        }}
                    >
                        {isPending ? (
                            <Loader2 className='animate-spin' />
                        ) : (
                            'Continuer'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteCustomerDialog;
