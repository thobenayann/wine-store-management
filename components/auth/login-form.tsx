'use client';

import { login } from '@/actions/login';
import { LoginSchema } from '@/schemas';
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

export default function LoginForm() {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const form = Useform<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            login(values).then((data) => {
                if (data) {
                    if (data.error) {
                        setError(data.error);
                    }

                    if (data.success) {
                        setSuccess(data.success);
                    }
                }
            });
        });
    };

    return (
        <CardWrapper
            headerLabel={`Bon retour parmi nous ! 👋`}
            headerTitle='Connexion'
            backButtonLabel='Pas encore de compte ?'
            backButtonHref='/auth/register'
            showSocial
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
                        Se connecter
                    </Button>
                    <FormError message={error} />
                    <FormSucess message={success} />
                </form>
            </Form>
        </CardWrapper>
    );
}
