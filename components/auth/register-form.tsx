'use client';

import { register } from '@/actions/register';
import { RegisterSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
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

export default function RegisterForm() {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const form = Useform<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            register(values).then((data) => {
                setError(data.error);
                setSuccess(data.success);
            });
        });
    };

    return (
        <CardWrapper
            headerLabel={`Créer un compte 🍷`}
            headerTitle='Inscription'
            backButtonLabel="J'ai déjà un compte."
            backButtonHref='/auth/login'
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 md:space-y-6'
                >
                    <div className='space-y-2 md:space-y-4'>
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
                        {/* FIRST NAME Field */}
                        <FormField
                            control={form.control}
                            name='firstName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='firstName'>
                                        Prénom
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id='firstName'
                                            type='text'
                                            placeholder='John'
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* LAST NAME Field */}
                        <FormField
                            control={form.control}
                            name='lastName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='lastName'>
                                        Nom
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id='lastName'
                                            type='text'
                                            placeholder='Doe'
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
                        Créer un compte
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
