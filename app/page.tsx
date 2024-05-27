import LoginButton from '@/components/auth/login-button';
import { Button } from '@/components/ui/button';
import { Spotlight } from '@/components/ui/Spotlight';
import Image from 'next/image';

export default function Home() {
    return (
        <main className='flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-800 to-black'>
            <div className='space-y-6'></div>
            <Spotlight fill='white' />
            <div className='p-4 max-w-7xl mx-auto z-10 w-full pt-20 md:pt-0 flex flex-col items-center'>
                <h1 className='text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50'>
                    Bienvenue <br />
                    dans votre appli de gestion
                    <br /> wine store.
                </h1>
                <Image
                    src='/gif/wired-flat-240-glass-of-wine.gif'
                    alt='wine gif'
                    width={240}
                    height={240}
                    unoptimized
                />
                <LoginButton>
                    <Button className='inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50'>
                        Connexion
                    </Button>
                </LoginButton>
            </div>
        </main>
    );
}
