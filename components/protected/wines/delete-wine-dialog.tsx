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
import { useToast } from '@/hooks/use-toast';
import { Wine } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    wine: Wine;
}

function DeleteWineDialog({ wine, setOpen, open }: Props) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: DeleteWine,
        onSuccess: async () => {
            toast({ description: `Le vin ${wine.name} a été supprimé` });

            await queryClient.invalidateQueries({
                queryKey: ['wines'],
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'Une erreur est survenue lors de la suppression.',
                variant: 'destructive',
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
                            isPending &&
                                toast({
                                    description:
                                        'Suppression du vin en cours...',
                                });
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
