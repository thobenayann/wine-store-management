'use client';

import { CreateWine } from '@/actions/wine';
import { getWineTypeSVG } from '@/app/(protected)/wines/_components/wines-table';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    frenchWineRegions,
    internationalWineRegions,
    WineType,
    wineTypeLabels,
} from '@/constants/wines';
import { CreateWineSchema, CreateWineSchemaType } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, PlusSquare } from 'lucide-react';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface CreateWineDialogProps {
    trigger?: ReactNode;
}

function CreateWineDialog({ trigger }: CreateWineDialogProps) {
    const [open, setOpen] = useState(false);
    const form = useForm<CreateWineSchemaType>({
        resolver: zodResolver(CreateWineSchema),
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: CreateWine,
        onSuccess: async (data) => {
            toast.success(`Le vin ${data?.name} a été ajouté! 🎉`, {
                id: 'create-wine',
            });
            await queryClient.invalidateQueries({
                queryKey: ['wines'],
            });
            setOpen((prev) => !prev);
            form.reset();
        },
        onError: (error) => {
            if (
                error.message ===
                'Un vin avec ce nom existe déjà pour cet utilisateur'
            ) {
                toast.error(error.message, { id: 'delete-wine-already' });
            } else {
                toast.error(`Echec lors de l'ajout du vin`, {
                    id: 'delete-wine',
                });
            }
        },
    });

    const onSubmit = (values: CreateWineSchemaType) => {
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
                        Ajouter un vin
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouveau vin</DialogTitle>
                    <DialogDescription>
                        Ajouter un vin au stock
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8 h-full'
                    >
                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Nom du vin'
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription className='max-sm:text-xs'>
                                            Le nom du vin qui apparaîtra dans
                                            l&apos;application
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='type'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isPending}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Type de vin' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(
                                                        wineTypeLabels
                                                    ).map(([value, label]) => (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                        >
                                                            <div className='flex items-center'>
                                                                {getWineTypeSVG(
                                                                    value as WineType
                                                                )}
                                                                {label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription className='max-sm:text-xs'>
                                            Il s&apos;agit du type tel que
                                            rouge, blanc, rosé
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='region'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Région</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isPending}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Sélectionnez une région' />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            <div className='flex gap-x-2'>
                                                                <p className='font-bold border-primary border-b-2'>
                                                                    Régions
                                                                    françaises
                                                                </p>
                                                                <Image
                                                                    src='/logos/france.png'
                                                                    alt='french flag'
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                            </div>
                                                        </SelectLabel>
                                                        {frenchWineRegions.map(
                                                            (region) => (
                                                                <SelectItem
                                                                    key={region}
                                                                    value={
                                                                        region
                                                                    }
                                                                >
                                                                    {region}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            <div className='flex gap-x-2'>
                                                                <p className='font-bold border-primary border-b-2'>
                                                                    Régions
                                                                    étrangères
                                                                </p>
                                                                <Image
                                                                    src='/logos/planet.png'
                                                                    alt='french flag'
                                                                    width={20}
                                                                    height={20}
                                                                />
                                                            </div>
                                                        </SelectLabel>
                                                        {internationalWineRegions.map(
                                                            (region) => (
                                                                <SelectItem
                                                                    key={region}
                                                                    value={
                                                                        region
                                                                    }
                                                                >
                                                                    {region}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormDescription className='max-sm:text-xs'>
                                            La région où le vin a été produit
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='year'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Année</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                value={field.value}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
                                                }
                                                min='1900'
                                                placeholder='Year'
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription className='max-sm:text-xs'>
                                            L&apos;année de production du vin
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prix HT(€)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                value={field.value}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                                min='0'
                                                step='0.01'
                                                placeholder='Price'
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription className='max-sm:text-xs'>
                                            Le prix hors taxe du vin
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='stock'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                value={field.value}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
                                                }
                                                min='0'
                                                placeholder='Stock'
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription className='max-sm:text-xs'>
                                            Il s&apos;agit du stock actuel du
                                            vin
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='stock_alert'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Alert</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                value={field.value}
                                                min='0'
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
                                                }
                                                placeholder='Stock Alert'
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription className='max-sm:text-xs'>
                                            Niveau d&apos;alerte du stock
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
                                disabled={isPending}
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

export default CreateWineDialog;
