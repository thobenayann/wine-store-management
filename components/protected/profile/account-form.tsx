'use client';

import { updateUser } from '@/actions/update-user';
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
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
    session: Session | null;
}

export default function AccountForm({ session }: AccountFormProps) {
    const [isEditable, setIsEditable] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [imageFile, setImageFile] = useState<File | null>(null);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues: {
            firstName: session?.user.firstName || '',
            lastName: session?.user.lastName || '',
            email: session?.user.email || '',
            password: '',
            // image: session?.user.image || null,
        },
    });

    const { toast } = useToast();
    const fileRef = form.register('image');

    const onSubmit = async (data: AccountFormValues) => {
        if (!session?.user.id) return;

        const formData = new FormData();
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('password', data.password || '');
        if (data.image && data.image.length > 0) {
            formData.append('image', data.image[0]);
        }

        try {
            const response = await updateUser(formData, session.user.id);
            if (response.error) {
                toast({
                    title: 'Error',
                    description: response.error,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Success',
                    description: response.success,
                });
                setIsEditable(false);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update user.',
                variant: 'destructive',
            });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setImageFile(file);
    };

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
                                    {...fileRef}
                                    onChange={(event) => {
                                        fileRef.onChange(event);
                                        form.setValue(
                                            'image',
                                            event.target.files
                                        );
                                    }}
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
                                        disabled={!isEditable || isPending}
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
                                        disabled={!isEditable || isPending}
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
                                        disabled={!isEditable || isPending}
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
