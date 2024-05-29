'use client';

import { newPassword } from '@/actions/new-password';
import { NewPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm as Useform } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { z } from 'zod';
import FormError from '../form-error';
import FormSucess from '../form-success';
import { Button } from '../ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import CardWrapper from './card-wrapper';

export default function NewPasswordForm() {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const searhParams = useSearchParams();
    const token = searhParams.get('token');

    const form = Useform<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        },
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            newPassword(values, token).then((data) => {
                setError(data.error);
                setSuccess(data.success);
            });
        });
    };

    return (
        <CardWrapper
            headerLabel={`Saisir un nouveau mot de passe`}
            headerTitle='Mot de passe 🔑'
            backButtonLabel='Retour à la connexion'
            backButtonHref='/auth/login'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        {/* PASSWORD Field */}
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='password'>
                                        Mot de passe
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id='password'
                                            type='password'
                                            placeholder='******'
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* SUBMIT BUTTON */}
                    <Button
                        type='submit'
                        className='w-full'
                        disabled={isPending}
                    >
                        Modifier le mot de passe
                    </Button>
                    <div className='flex justify-center'>
                        {isPending && <BeatLoader />}
                    </div>
                    <FormError message={error} />
                    <FormSucess message={success} />
                </form>
            </Form>
        </CardWrapper>
    );
}
