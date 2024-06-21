import { getUserSettings } from '@/actions/user-settings';
import AccountForm from '@/components/protected/profile/account-form';
import UserSettingsForm from '@/components/protected/profile/user-settings.form';
import { Separator } from '@/components/ui/separator';
import { getCurrentUserSession } from '@/lib/getSession';

async function profilePage() {
    const session = await getCurrentUserSession();
    let userSettings = null;

    if (session && session.user.id) {
        try {
            userSettings = await getUserSettings(session.user.id);
        } catch (error) {
            console.error('Failed to fetch user settings:', error);
        }
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Profile</h1>
            <AccountForm session={session} />
            <Separator className='my-4' />
            <UserSettingsForm userSettings={userSettings} />
        </div>
    );
}

export default profilePage;
