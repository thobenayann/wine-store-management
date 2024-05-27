import NewPasswordForm from '@/components/auth/new-password-form';
import { Suspense } from 'react';

function NewPasswordPage() {
    return (
        <Suspense>
            <NewPasswordForm />
        </Suspense>
    );
}

export default NewPasswordPage;
