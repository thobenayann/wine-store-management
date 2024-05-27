import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import Image from 'next/image';
import { Button } from '../ui/button';

function Social() {
    const onClick = (provider: 'google') => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT,
        });
    };
    return (
        <div className='flex items-center w-full gap-x-2'>
            <Button
                size='lg'
                className='w-full'
                variant='outline'
                onClick={async () => onClick('google')}
            >
                <Image
                    src='/logos/google.svg'
                    alt='Google'
                    width={20}
                    height={20}
                />
            </Button>
        </div>
    );
}

export default Social;
