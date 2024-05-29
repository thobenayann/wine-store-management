'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
    name: string;
    href: string;
    className?: string;
    children?: ReactNode;
    badge?: ReactNode;
}

const NavLink = ({ name, href, className, children, badge }: NavLinkProps) => {
    const currentPathname = usePathname();
    const isActive = href === currentPathname;

    return (
        <Link
            href={href}
            className={cn(className, { 'bg-muted text-primary': isActive })}
        >
            {children}
            {name}
            {badge && <span className='ml-auto'>{badge}</span>}
        </Link>
    );
};

export default NavLink;
