import DesktopMenu from '@/components/protected/shared/desktop-menu';
import HeaderMenu from '@/components/protected/shared/header-menu';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='md:grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
            <DesktopMenu />
            <div className='flex flex-col'>
                <HeaderMenu />
                {children}
            </div>
        </div>
    );
}

export default layout;
