import { signOut } from '@/auth';
import { Button } from '../ui/button';

function LogoutBtn() {
    return (
        <div>
            <form
                action={async () => {
                    'use server';

                    await signOut();
                }}
            >
                <Button type='submit'>Se déconnecter</Button>
            </form>
        </div>
    );
}

export default LogoutBtn;
