'use client';

import { useRouter } from 'next/navigation';

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: 'modal' | 'redirect';
    asChildren?: boolean;
}

function LoginButton({ children, mode }: LoginButtonProps) {
    const router = useRouter();

    const onClick = () => {
        router.push('/auth/login');
    };

    if (mode === 'modal') {
        return <span>TODO: Modal</span>;
    }

    return <span onClick={onClick}>{children}</span>;
}

export default LoginButton;
