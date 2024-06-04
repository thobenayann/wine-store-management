'use client';

import { updateWineAction } from '@/actions/wine';
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
import { UpdateWineSchema, UpdateWineSchemaType } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wine } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UpdateWineDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    wine: Wine;
}

function UpdateWineDialog({ wine, setOpen, open }: UpdateWineDialogProps) {
    const form = useForm<UpdateWineSchemaType>({
        resolver: zodResolver(UpdateWineSchema),
        defaultValues: wine,
    });

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: async (values: UpdateWineSchemaType) => {
            await updateWineAction(values, wine.id, wine.userId);
        },
        onSuccess: async () => {
            toast.success(`Wine ${wine.name} updated successfully! 🎉`);
            await queryClient.invalidateQueries({
                queryKey: ['wines'],
            });
            setOpen(false);
            form.reset();
        },
        onError: (error) => {
            console.error('error', error);
            toast.error('Failed to update wine data');
        },
    });

    const onSubmit = (values: UpdateWineSchemaType) => {
        mutate(values);
    };

    useEffect(() => {
        if (open) {
            form.reset(wine);
        }
    }, [open, wine, form]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier vin</DialogTitle>
                    <DialogDescription>
                        Modifier les détails du vin
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
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Nom du vin'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
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
                                        <FormDescription>
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
                                                            (
                                                                region: string
                                                            ) => (
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
                                            />
                                        </FormControl>
                                        <FormDescription>
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
                                        <FormLabel>Prix (€)</FormLabel>
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
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Le prix du vin en euros
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
                                            />
                                        </FormControl>
                                        <FormDescription>
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
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
                                                }
                                                min='0'
                                                placeholder='Stock Alert'
                                            />
                                        </FormControl>
                                        <FormDescription>
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
                                disabled={form.formState.isSubmitting}
                            >
                                {!form.formState.isSubmitting && 'Modifier'}
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

export default UpdateWineDialog;
