'use client';

import { UpdateCustomer } from '@/actions/customers';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { UpdateCustomerSchema, UpdateCustomerSchemaType } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Customer } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UpdateCustomerDialogProps {
    customer: Customer;
    open: boolean;
    setOpen: (open: boolean) => void;
}

function UpdateCustomerDialog({
    customer,
    setOpen,
    open,
}: UpdateCustomerDialogProps) {
    const form = useForm<UpdateCustomerSchemaType>({
        resolver: zodResolver(UpdateCustomerSchema),
        defaultValues: {
            id: customer.id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            email: customer.email,
            phone: customer.phone,
            adresse: customer.adresse,
            company: customer.company || '',
        },
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: UpdateCustomer,
        onSuccess: async () => {
            toast.success(
                `Le client ${customer.first_name} ${customer.last_name} a été mis à jour! 🎉`,
                {
                    id: 'update-customer-success',
                }
            );
            await queryClient.invalidateQueries({
                queryKey: ['customers'],
            });
            setOpen(false);
            form.reset();
        },
        onError: (error: any) => {
            if (error.message === 'Un client avec cet email existe déjà') {
                toast.error(error.message, { id: 'update-customer-already' });
            } else {
                toast.error(`Echec lors de la mise à jour du client`, {
                    id: 'update-customer-error',
                });
            }
        },
    });

    const onSubmit = (values: UpdateCustomerSchemaType) => {
        mutate(values);
    };

    useEffect(() => {
        if (open) {
            form.reset(customer);
        }
    }, [open, customer, form]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier client</DialogTitle>
                    <DialogDescription>
                        Modifier les détails du client
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                    >
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='first_name'
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Prénom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Prénom du client'
                                                {...field}
                                                disabled={isPending}
                                                className={
                                                    fieldState.error
                                                        ? 'animate-shake border-red-500'
                                                        : ''
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription
                                            className={
                                                fieldState.error
                                                    ? 'animate-shake text-red-500'
                                                    : ''
                                            }
                                        >
                                            {fieldState.error
                                                ? fieldState.error.message
                                                : 'Le prénom du client'}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='last_name'
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Nom du client'
                                                {...field}
                                                disabled={isPending}
                                                className={
                                                    fieldState.error
                                                        ? 'animate-shake border-red-500'
                                                        : ''
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription
                                            className={
                                                fieldState.error
                                                    ? 'animate-shake text-red-500'
                                                    : ''
                                            }
                                        >
                                            {fieldState.error
                                                ? fieldState.error.message
                                                : 'Le nom du client'}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder='Email du client'
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription
                                            className={
                                                fieldState.error
                                                    ? 'animate-shake text-red-500'
                                                    : ''
                                            }
                                        >
                                            {fieldState.error
                                                ? fieldState.error.message
                                                : "L'adresse email du client"}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='phone'
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Téléphone du client'
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription
                                            className={
                                                fieldState.error
                                                    ? 'animate-shake text-red-500'
                                                    : ''
                                            }
                                        >
                                            {fieldState.error
                                                ? fieldState.error.message
                                                : 'Le numéro de téléphone du client'}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='adresse'
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Adresse</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Adresse du client'
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription
                                            className={
                                                fieldState.error
                                                    ? 'animate-shake text-red-500'
                                                    : ''
                                            }
                                        >
                                            {fieldState.error
                                                ? fieldState.error.message
                                                : "L'adresse du client"}
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='company'
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Entreprise (optionnel)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nom de l'entreprise du client"
                                                {...field}
                                                value={field.value ?? ''}
                                            />
                                        </FormControl>
                                        <FormDescription
                                            className={
                                                fieldState.error
                                                    ? 'animate-shake text-red-500'
                                                    : ''
                                            }
                                        >
                                            {fieldState.error
                                                ? fieldState.error.message
                                                : "Le nom de l'entreprise du client (optionnel)"}
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
                            <Button type='submit' disabled={isPending}>
                                {!isPending && 'Modifier'}
                                {isPending && (
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

export default UpdateCustomerDialog;
