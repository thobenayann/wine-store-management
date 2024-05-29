import Link from 'next/link';
import Image from 'next/image';
import { Bell, Euro, Home, Users, UserRoundCog, Wine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import NavLink from './nav-link';

export default function DesktopMenu() {
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <Image
                            className="h-6 w-6"
                            src="/logos/wine-glass.svg"
                            alt="wine glass"
                            width={80}
                            height={80}
                        />
                        <span className="">WSM</span>
                    </Link>
                    <Button
                        variant="outline"
                        size="icon"
                        className="ml-auto h-8 w-8"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <NavLink
                            href="/dashboard"
                            name="Dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Home className="h-4 w-4" />
                        </NavLink>
                        <NavLink
                            href="/invoices"
                            name="Facturation"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                            badge={
                                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                    6
                                </Badge>
                            }
                        >
                            <Euro className="h-4 w-4" />
                        </NavLink>
                        <NavLink
                            href="/wines"
                            name="Vins"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Wine className="h-4 w-4" />
                        </NavLink>
                        <NavLink
                            href="/customers"
                            name="Clients"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Users className="h-4 w-4" />
                        </NavLink>
                        <NavLink
                            href="/profile"
                            name="Profile"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <UserRoundCog className="h-4 w-4" />
                        </NavLink>
                    </nav>
                </div>
            </div>
        </div>
    );
}