'use client';

import { DeleteWine } from '@/actions/wine';
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
import { Wine } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    wine: Wine;
}

function DeleteWineDialog({ wine, setOpen, open }: Props) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: DeleteWine,
        onSuccess: async () => {
            toast.success(`Le vin ${wine.name} a été supprimé! 🎉`, {
                id: 'create-wine',
            });

            await queryClient.invalidateQueries({
                queryKey: ['wines'],
            });
        },
        onError: () => {
            toast.error(`Echec lors de la suppression du vin`, {
                id: 'delete-wine',
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
                        définitivement le vin {wine.name}.
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
                            mutate({ id: wine.id });
                        }}
                    >
                        Continuer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteWineDialog;
