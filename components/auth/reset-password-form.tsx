'use client';

import { resetPassword } from '@/actions/reset-password';
import { ResetPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { useForm as Useform } from 'react-hook-form';
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

export default function ResetPasswordForm() {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const form = Useform<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
        setError('');
        setSuccess('');

        console.log('values', values);

        startTransition(() => {
            resetPassword(values).then((data) => {
                if (data) {
                    setError(data?.error);
                    setSuccess(data?.success);
                }
            });
        });
    };

    return (
        <CardWrapper
            headerLabel={`Mot de passe oublié? 😢`}
            headerTitle='Mot de passe'
            backButtonLabel='Retour à la connexion'
            backButtonHref='/auth/login'
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        {/* EMAIL Field */}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='email'>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id='email'
                                            type='email'
                                            placeholder='john.doe@example.com'
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
                        Envoyer un mail de réinitialisation
                    </Button>
                    <FormError message={error} />
                    <FormSucess message={success} />
                </form>
            </Form>
        </CardWrapper>
    );
}
