import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter as FontSans, Merriweather as FontSerif } from 'next/font/google';
import AuthWrapper from './auth-wrapper';
import './globals.css';

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

const fontSerif = FontSerif({
    subsets: ['latin'],
    variable: '--font-serif',
    weight: ['400', '700'],
});

export const metadata: Metadata = {
    title: 'Wine store management',
    description: 'Application for managing a wine store',
    icons: {
        icon: [
            {
                media: '(prefers-color-scheme: light)',
                url: '/images/icon-light.png',
                href: '/images/icon-light.png',
            },
            {
                media: '(prefers-color-scheme: dark)',
                url: '/images/icon.png',
                href: '/images/icon-dark.png',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='fr' suppressHydrationWarning>
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable,
                    fontSerif.variable
                )}
            >
                <AuthWrapper>
                    <ThemeProvider
                        attribute='class'
                        defaultTheme='system'
                        enableSystem
                        disableTransitionOnChange
                    >
                        <main>{children}</main>
                    </ThemeProvider>
                </AuthWrapper>
                <Toaster />
            </body>
        </html>
    );
}
