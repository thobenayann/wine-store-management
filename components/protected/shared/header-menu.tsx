import LogoutBtn from '@/components/auth/logout-btn';
import UserMenuTrigger from '@/components/auth/user-icon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { getCurrentUserSession } from '@/lib/getSession';
import { Search } from 'lucide-react';
import Link from 'next/link';
import MobileMenu from './mobile-menu';

async function HeaderMenu() {
    const session = await getCurrentUserSession();

    return (
        <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
            <MobileMenu />
            <div className='w-full flex-1'>
                <form>
                    <div className='relative'>
                        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                        <Input
                            type='search'
                            placeholder='Search products...'
                            className='w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3'
                        />
                    </div>
                </form>
            </div>
            <ModeToggle />
            <DropdownMenu>
                <UserMenuTrigger />
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>{`Hello ${
                        session?.user?.firstName ?? ''
                    } 👋`}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link
                        href='/profile'
                        className='transition-colors hover:bg-muted/50'
                    >
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                        <Link
                            href='/terms-and-conditions'
                            className='transition-colors hover:bg-muted/50'
                        >
                            Conditions d&apos;utilisation
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LogoutBtn />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}

export default HeaderMenu;
