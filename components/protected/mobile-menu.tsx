import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Menu, UserRoundCog, Wine, Users, Euro } from 'lucide-react';
import NavLink from './nav-link';

export default function MobileMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <NavLink
                        href="#"
                        name=""
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        <Image
                            className="h-6 w-6"
                            src="/logos/wine-glass.svg"
                            alt="wine glass"
                            width={80}
                            height={80}
                        />
                        <span className="">WSM</span>
                    </NavLink>
                    <NavLink
                        href="/dashboard"
                        name="Dashboard"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
                    >
                        <Home className="h-4 w-4" />
                    </NavLink>
                    <NavLink
                        href="/invoices"
                        name="Facturation"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-foreground hover:text-foreground"
                        badge={
                            <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                6
                            </Badge>
                        }
                    >
                        <Euro className="h-5 w-5" />
                    </NavLink>
                    <NavLink
                        href="/wines"
                        name="Vins"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
                    >
                        <Wine className="h-5 w-5" />
                    </NavLink>
                    <NavLink
                        href="/customers"
                        name="Clients"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
                    >
                        <Users className="h-5 w-5" />
                    </NavLink>
                    <NavLink
                        href="/profile"
                        name="Profile"
                        className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
                    >
                        <UserRoundCog className="h-5 w-5" />
                    </NavLink>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
