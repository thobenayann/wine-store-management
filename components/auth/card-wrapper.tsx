'use client';

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import BackButton from './back-button';
import Header from './header';
import Social from './social';

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

function cardWrapper({
    children,
    headerLabel,
    showSocial,
    backButtonLabel,
    backButtonHref,
}: CardWrapperProps) {
    return (
        <Card className='w-[400px] shadow-md'>
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocial ? (
                <CardFooter>
                    <Social />
                </CardFooter>
            ) : null}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card>
    );
}

export default cardWrapper;
