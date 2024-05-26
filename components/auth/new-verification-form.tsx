'use client';

import { newVerification } from '@/actions/new-verification';
import CardWrapper from '@/components/auth/card-wrapper';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import FormError from '../form-error';
import FormSuccess from '../form-success';

function NewVerificationForm() {
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError('Missing token!');
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data?.success);
                setError(data?.error);
            })
            .catch(() => {
                setError('Une erreur est survenue');
            });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerLabel='Confirmation de votre email'
            backButtonLabel='Retour à la page de connexion'
            backButtonHref='/auth/login'
            headerTitle='Connexion'
        >
            <div className='flex items-center w-full justify-center'>
                {!success && !error && <BeatLoader />}
                <FormError message={error} />
                <FormSuccess message={success} />
            </div>
        </CardWrapper>
    );
}

export default NewVerificationForm;
