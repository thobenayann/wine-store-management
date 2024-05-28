import { auth } from '@/auth';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CircleUser } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

export default async function UserMenuTrigger() {
    const session = await auth();

    const userImage = session?.user?.image;

    return (
        <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='icon' className='rounded-full'>
                {userImage ? (
                    <Image
                        src={userImage}
                        alt='User Avatar'
                        className='h-full w-full rounded-full'
                        width={80}
                        height={80}
                    />
                ) : (
                    <CircleUser className='h-5 w-5' />
                )}
                <span className='sr-only'>Toggle user menu</span>
            </Button>
        </DropdownMenuTrigger>
    );
}
