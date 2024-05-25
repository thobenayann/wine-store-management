'use client';

import Image from 'next/image';
import { Button } from '../ui/button';

function Social() {
    return (
        <div className='flex items-center w-full gap-x-2'>
            <Button
                size='lg'
                className='w-full'
                variant='outline'
                onClick={() => {}}
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
