import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

async function profilePage() {
    const session = await auth();
    return (
        <div>
            {JSON.stringify(session)}
            <form
                action={async () => {
                    'use server';

                    await signOut();
                }}
            >
                <Button type="submit">Se déconnecter</Button>
            </form>
        </div>
    );
}

export default profilePage;
