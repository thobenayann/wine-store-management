'use client';

import { CreateCustomer } from '@/actions/customers';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateCustomerSchema, CreateCustomerSchemaType } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, PlusSquare } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CreateCustomerDialogProps {
    trigger?: ReactNode;
}

function CreateCustomerDialog({ trigger }: CreateCustomerDialogProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<CreateCustomerSchemaType>({
        resolver: zodResolver(CreateCustomerSchema),
    });

    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationFn: CreateCustomer,
        onSuccess: async (data) => {
            toast.success(
                `Le client ${data?.first_name} ${data?.last_name} a été ajouté! 🎉`,
                {
                    id: 'create-customer',
                }
            );
            await queryClient.invalidateQueries({
                queryKey: ['customers'],
            });
            setOpen((prev) => !prev);
            form.reset();
        },
        onError: (error: any) => {
            if (
                error.message ===
                'Un client avec cet email existe déjà pour cet utilisateur'
            ) {
                toast.error(error.message, { id: 'create-customer-already' });
            } else {
                toast.error(`Echec lors de l'ajout du client`, {
                    id: 'create-customer-failed',
                });
            }
        },
    });

    const onSubmit = (values: CreateCustomerSchemaType) => {
        mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant={'ghost'}
                        className='flex items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'
                    >
                        <PlusSquare className='mr-2 h-4 w-4' />
                        Ajouter un client
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouveau client</DialogTitle>
                    <DialogDescription>Ajouter un client</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8 h-full'
                    >
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='first_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Prénom du client'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Le prénom du client
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='last_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Nom du client'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Le nom du client
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder='Email du client'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            L&apos;adresse email du client
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Téléphone du client'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Le numéro de téléphone du client
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='adresse'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Adresse du client'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            L&apos;adresse du client
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='company'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Entreprise (optionnel)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nom de l'entreprise du client"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Le nom de l&apos;entreprise du
                                            client (optionnel)
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type='button'
                                    variant={'secondary'}
                                    onClick={() => {
                                        form.reset();
                                    }}
                                >
                                    Annuler
                                </Button>
                            </DialogClose>
                            <Button
                                type='submit'
                                disabled={form.formState.isSubmitting}
                                className='max-md:mb-4'
                            >
                                {!form.formState.isSubmitting && 'Créer'}
                                {form.formState.isSubmitting && (
                                    <Loader2 className='animate-spin' />
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCustomerDialog;
