'use client';

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
import InputFile from '@/components/ui/input-file';
import { useToast } from '@/hooks/use-toast';
import { accountFormSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from 'next-auth';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
    session: Session | null;
}

export default function AccountForm({ session }: AccountFormProps) {
    const [isEditable, setIsEditable] = useState(false);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            firstName: session?.user.firstName || '',
            lastName: session?.user.lastName || '',
            email: session?.user.email || '',
            password: '',
            image: session?.user.image || '',
        },
    });

    const { toast } = useToast();

    function onSubmit(data: AccountFormValues) {
        console.log('SUBMIT');
        toast({
            title: 'You submitted the following values:',
            description: (
                <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
    }

    if (!session) return null;
    const { user } = session;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <div className='flex max-md:flex-col max-md:items-center max-sm:space-y-8 md:space-x-10'>
                    <div className='flex items-center w-full space-x-6 md:space-x-10'>
                        {user && user.image ? (
                            <Image
                                src={user.image}
                                alt='User Avatar'
                                className='h-20 w-20 rounded-full object-cover'
                                width={80}
                                height={80}
                            />
                        ) : (
                            <div className='flex items-center justify-center h-20 w-20 min-w-[80px] rounded-full bg-gray-900 dark:bg-gray-700'>
                                <span className='text-3xl text-white dark:text-gray-200'>
                                    {user && user.firstName
                                        ? user.firstName.charAt(0).toUpperCase()
                                        : null}
                                </span>
                            </div>
                        )}
                        {isEditable ? (
                            <FormItem>
                                <InputFile
                                    htmlFor='picture'
                                    label='Image'
                                    disabled={!isEditable}
                                />
                            </FormItem>
                        ) : null}
                    </div>
                </div>
                <div className='flex max-md:flex-col max-md:items-center max-sm:space-y-8 md:space-x-10'>
                    <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                            <FormItem className='w-full sm:w-1/2'>
                                <FormLabel>Prénom</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Votre prénom'
                                        {...field}
                                        disabled={!isEditable}
                                    />
                                </FormControl>
                                <FormDescription>
                                    C&apos;est le prénom qui sera affiché sur
                                    votre profile.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                            <FormItem className='w-full sm:w-1/2'>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Votre nom de famille'
                                        {...field}
                                        disabled={!isEditable}
                                    />
                                </FormControl>
                                <FormDescription>
                                    C&apos;est le nom qui sera affiché sur votre
                                    profile.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex max-md:flex-col max-md:items-center max-sm:space-y-8 md:space-x-10'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem className='w-full sm:w-1/2'>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Votre email'
                                        {...field}
                                        disabled={!isEditable}
                                    />
                                </FormControl>
                                <FormDescription>
                                    C&apos;est l&apos;Email qui servira à vous
                                    connecter.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem className='w-full sm:w-1/2'>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='********'
                                        {...field}
                                        disabled={!isEditable}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Laissez vide si vous ne voulez pas changer
                                    votre mot de passe.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className='flex max-md:justify-center'>
                    {isEditable ? (
                        <Button type='submit' className='max-sm:w-full'>
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
    );
}
