'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

interface BackButtonProps {
    label: string;
    href: string;
}

function BackButton({ label, href }: BackButtonProps) {
    return (
        <Button
            size='sm'
            variant='link'
            asChild
            onClick={() => {}}
            className='font-normal w-full'
        >
            <Link href={href}>{label}</Link>
        </Button>
    );
}

export default BackButton;
