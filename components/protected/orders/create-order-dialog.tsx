'use client';

import { CreateOrder } from '@/actions/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CreateOrderSchema, CreateOrderSchemaType } from '@/schemas';
import { CustomerRow } from '@/types/customer';
import { WineRow } from '@/types/wine';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, PlusSquare } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CreateOrderDialogProps {
    trigger?: ReactNode;
}

function CreateOrderDialog({ trigger }: CreateOrderDialogProps) {
    const [lineError, setLineError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const form = useForm<CreateOrderSchemaType>({
        resolver: zodResolver(CreateOrderSchema),
        defaultValues: {
            client_id: '',
            lines: [
                {
                    wine_id: '',
                    quantity: 1,
                    unit_price: 0,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'lines',
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: CreateOrder,
        onSuccess: async (data) => {
            toast.success(`La commande a été ajoutée! 🎉`, {
                id: 'create-order',
            });
            await queryClient.invalidateQueries({ queryKey: ['orders'] });
            setOpen((prev) => !prev);
            form.reset();
        },
        onError: (error) => {
            toast.error(`Échec lors de l'ajout de la commande`, {
                id: 'create-order-error',
            });
        },
    });

    const handleCreateClick = () => {
        if (fields.length === 0) {
            setLineError(
                'Une ligne au minimum doit être saisie pour créer une commande'
            );
        } else {
            form.handleSubmit(onSubmit)();
        }
    };

    const onSubmit = (values: CreateOrderSchemaType) => {
        mutate(values);
    };

    const clientsQuery = useQuery<CustomerRow[]>({
        queryKey: ['customers'],
        queryFn: () => fetch(`/api/customers`).then((res) => res.json()),
    });

    const winesQuery = useQuery<WineRow[]>({
        queryKey: ['wines'],
        queryFn: () => fetch(`/api/wines`).then((res) => res.json()),
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant='ghost'
                        className='flex items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'
                    >
                        <PlusSquare className='mr-2 h-4 w-4' />
                        Ajouter une commande
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className='max-w-5xl'>
                <DialogHeader>
                    <DialogTitle>Nouvelle commande</DialogTitle>
                    <DialogDescription>
                        Ajouter une commande pour un client
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                    >
                        <div className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='client_id'
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Client</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isPending}
                                            >
                                                <SelectTrigger
                                                    className={
                                                        fieldState.error
                                                            ? 'animate-shake border-red-500'
                                                            : ''
                                                    }
                                                >
                                                    <SelectValue placeholder='Sélectionnez un client' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {clientsQuery.data?.map(
                                                        (client) => (
                                                            <SelectItem
                                                                key={client.id}
                                                                value={
                                                                    client.id
                                                                }
                                                            >
                                                                {
                                                                    client.first_name
                                                                }{' '}
                                                                {
                                                                    client.last_name
                                                                }
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription>
                                            Sélectionnez le client pour cette
                                            commande
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Card className='flex flex-col border-2 border-dotted'>
                                <CardContent
                                    className={cn(
                                        'space-y-2',
                                        `${
                                            fields.length > 4
                                                ? 'overflow-y-scroll max-h-96'
                                                : ''
                                        }`
                                    )}
                                >
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className='grid grid-cols-2 max-md:border-b-2 max-md:pb-2 md:grid-cols-6 gap-4'
                                        >
                                            <FormField
                                                control={form.control}
                                                name={`lines.${index}.wine_id`}
                                                render={({
                                                    field,
                                                    fieldState,
                                                }) => (
                                                    <FormItem className='col-span-2'>
                                                        {index === 0 && (
                                                            <FormLabel>
                                                                Vin
                                                            </FormLabel>
                                                        )}
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={(
                                                                    value
                                                                ) => {
                                                                    field.onChange(
                                                                        value
                                                                    );
                                                                    const selectedWine =
                                                                        winesQuery.data?.find(
                                                                            (
                                                                                wine
                                                                            ) =>
                                                                                wine.id ===
                                                                                value
                                                                        );
                                                                    if (
                                                                        selectedWine
                                                                    ) {
                                                                        form.setValue(
                                                                            `lines.${index}.unit_price`,
                                                                            selectedWine.price
                                                                        );
                                                                    }
                                                                }}
                                                                value={
                                                                    field.value
                                                                }
                                                                disabled={
                                                                    isPending
                                                                }
                                                            >
                                                                <SelectTrigger
                                                                    className={
                                                                        fieldState.error
                                                                            ? 'animate-shake border-red-500'
                                                                            : ''
                                                                    }
                                                                >
                                                                    <SelectValue placeholder='Sélectionnez un vin' />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {winesQuery.data?.map(
                                                                        (
                                                                            wine
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    wine.id
                                                                                }
                                                                                value={
                                                                                    wine.id
                                                                                }
                                                                            >
                                                                                {
                                                                                    wine.name
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`lines.${index}.quantity`}
                                                render={({
                                                    field,
                                                    fieldState,
                                                }) => (
                                                    <FormItem>
                                                        {index === 0 && (
                                                            <FormLabel>
                                                                Quantité
                                                            </FormLabel>
                                                        )}
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            10
                                                                        )
                                                                    )
                                                                }
                                                                min='1'
                                                                placeholder='Quantité'
                                                                disabled={
                                                                    isPending
                                                                }
                                                                className={
                                                                    fieldState.error
                                                                        ? 'border-red-500'
                                                                        : ''
                                                                }
                                                            />
                                                        </FormControl>
                                                        {fieldState.error && (
                                                            <p className='text-red-600'>
                                                                {
                                                                    fieldState
                                                                        .error
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`lines.${index}.unit_price`}
                                                render={({
                                                    field,
                                                    fieldState,
                                                }) => (
                                                    <FormItem>
                                                        {index === 0 && (
                                                            <FormLabel>
                                                                Prix unitaire
                                                                (€)
                                                            </FormLabel>
                                                        )}
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                {...field}
                                                                value={
                                                                    field.value
                                                                }
                                                                min='0'
                                                                step='0.01'
                                                                placeholder='Prix unitaire'
                                                                disabled={
                                                                    isPending
                                                                }
                                                                className={
                                                                    fieldState.error
                                                                        ? 'animate-shake border-red-500'
                                                                        : ''
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`lines.${index}.discount`}
                                                render={({
                                                    field,
                                                    fieldState,
                                                }) => (
                                                    <FormItem>
                                                        {index === 0 && (
                                                            <FormLabel>
                                                                Remise
                                                            </FormLabel>
                                                        )}
                                                        <FormControl>
                                                            <Input
                                                                type='number'
                                                                {...field}
                                                                value={
                                                                    field.value
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const value =
                                                                        parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    field.onChange(
                                                                        value >=
                                                                            0
                                                                            ? value
                                                                            : 0
                                                                    );
                                                                }}
                                                                min='0'
                                                                step='1'
                                                                placeholder='Remise'
                                                                disabled={
                                                                    isPending
                                                                }
                                                                className={
                                                                    fieldState.error
                                                                        ? 'animate-shake border-red-500'
                                                                        : ''
                                                                }
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <div className='h-full flex items-end'>
                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    onClick={() => {
                                                        remove(index);
                                                        setLineError(null);
                                                    }}
                                                >
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => {
                                    append({
                                        wine_id: '',
                                        quantity: 1,
                                        unit_price: 0,
                                    });
                                    setLineError(null);
                                }}
                            >
                                Ajouter une ligne de commande
                            </Button>
                        </div>
                        {lineError && (
                            <p className='text-red-600'>{lineError}</p>
                        )}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type='button'
                                    variant='secondary'
                                    onClick={() => {
                                        form.reset();
                                    }}
                                >
                                    Annuler
                                </Button>
                            </DialogClose>
                            <Button
                                type='submit'
                                disabled={isPending}
                                onClick={handleCreateClick}
                                className='max-md:mb-4'
                            >
                                {!isPending && 'Créer'}
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

export default CreateOrderDialog;
