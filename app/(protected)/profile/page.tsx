import { auth } from '@/auth';
import AccountForm from '@/components/protected/profile/account-form';
import { Session } from 'next-auth';

async function profilePage() {
    const session: Session | null = await auth();
    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Profile</h1>
            <AccountForm session={session} />
        </div>
    );
}

export default profilePage;
