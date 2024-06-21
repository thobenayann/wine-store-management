'use client';

import { updateUserSettings } from '@/actions/user-settings';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserSettingsFormValues, userSettingsSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSettings } from '@prisma/client';
import { useState, useTransition } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

interface UserSettingsFormProps {
    userSettings: UserSettings | null;
}

export default function UserSettingsForm({
    userSettings,
}: UserSettingsFormProps) {
    const [isEditable, setIsEditable] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<UserSettingsFormValues>({
        resolver: zodResolver(userSettingsSchema),
        defaultValues: {
            vat_rate: userSettings?.vat_rate,
            payment_terms: userSettings?.payment_terms,
            currency: userSettings?.currency,
        },
    });

    const watchedValues = useWatch({ control: form.control });

    const onSubmit = async (data: UserSettingsFormValues) => {
        if (!userSettings?.user_id) return;

        const hasChanged =
            data.vat_rate !== userSettings.vat_rate ||
            data.payment_terms !== userSettings.payment_terms;

        if (!hasChanged) {
            setIsEditable(false);
            return;
        }

        startTransition(() => {
            updateUserSettings(data, userSettings.user_id)
                .then((response) => {
                    if (response.error) {
                        toast.error(
                            `Erreur lors de la modification de vos paramètres.`,
                            {
                                id: 'update-user-settings-error',
                            }
                        );
                    } else {
                        toast.success(`Vos paramètres ont été modifiés! 🎉`, {
                            id: 'update-user-settings',
                        });
                        setIsEditable(false);
                    }
                })
                .catch((error: any) => {
                    toast.error(
                        `Erreur lors de la modification de vos paramètres.`,
                        {
                            id: 'update-user-settings-error',
                        }
                    );
                    console.error('Failed to update user settings:', error);
                });
        });
    };

    return (
        <>
            <h2 className='text-xl font-bold mb-4'>Paramètres</h2>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                >
                    <div className='flex max-md:flex-col max-md:items-center max-sm:space-y-8 md:space-x-10'>
                        <FormField
                            control={form.control}
                            name='vat_rate'
                            render={({ field, fieldState }) => (
                                <FormItem className='w-full sm:w-1/2'>
                                    <FormLabel>Taux de TVA (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            min='0'
                                            step='0.01'
                                            placeholder='Taux de TVA (%)'
                                            disabled={!isEditable}
                                            className={
                                                fieldState.error
                                                    ? 'animate-shake border-red-500'
                                                    : ''
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        C&apos;est le taux de TVA par défaut
                                        pour vos factures.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='payment_terms'
                            render={({ field, fieldState }) => (
                                <FormItem className='w-full sm:w-1/2'>
                                    <FormLabel>
                                        Délai de paiement en jour(s)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            {...field}
                                            value={field.value ?? ''}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(e.target.value, 10)
                                                )
                                            }
                                            min='0'
                                            placeholder='Délai de paiement en jours'
                                            disabled={!isEditable}
                                            className={
                                                fieldState.error
                                                    ? 'animate-shake border-red-500'
                                                    : ''
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        C&apos;est le délai de paiement par
                                        défaut pour vos factures.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='currency'
                            render={({ field, fieldState }) => (
                                <FormItem className='w-full sm:w-1/2'>
                                    <FormLabel>Monnaie</FormLabel>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                            placeholder='Monnaie'
                                                            disabled={true}
                                                            className={
                                                                fieldState.error
                                                                    ? 'animate-shake border-red-500'
                                                                    : ''
                                                            }
                                                        />
                                                    </FormControl>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                La devise ne peut pas encore
                                                être changée.
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <FormDescription>
                                        C&apos;est la monnaie par défaut pour
                                        vos transactions.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex max-md:justify-center'>
                        {isEditable ? (
                            <Button
                                type='submit'
                                className='max-sm:w-full'
                                onClick={(event) => {
                                    event.preventDefault();
                                    if (
                                        watchedValues.vat_rate ===
                                            userSettings?.vat_rate &&
                                        watchedValues.payment_terms ===
                                            userSettings?.payment_terms
                                    ) {
                                        setIsEditable(false);
                                    } else {
                                        form.handleSubmit(onSubmit)(event);
                                    }
                                }}
                            >
                                Mettre à jour
                            </Button>
                        ) : (
                            <Button
                                type='button'
                                className='max-sm:w-full'
                                onClick={(event) => {
                                    event.preventDefault();
                                    setIsEditable(true);
                                }}
                            >
                                Modifier
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </>
    );
}
