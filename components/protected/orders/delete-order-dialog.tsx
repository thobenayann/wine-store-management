'use client';

import { DeleteOrder } from '@/actions/orders';
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
import { Order } from '@/schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    order: Order;
}

function DeleteOrderDialog({ order, setOpen, open }: Props) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: DeleteOrder,
        onSuccess: async () => {
            toast.success(`La commande a été supprimé! 🎉`, {
                id: 'delete-order',
            });

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['orders'],
                }),
                queryClient.invalidateQueries({
                    queryKey: ['pendingOrdersCount'],
                }),
            ]);
        },
        onError: () => {
            toast.error(`Echec lors de la suppression de la commande`, {
                id: 'delete-order-fail',
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
                        définitivement la commande.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            {
                                isPending && (
                                    <Loader2 className='animate-spin' />
                                );
                            }
                            mutate({ id: order.id });
                        }}
                    >
                        Continuer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteOrderDialog;
