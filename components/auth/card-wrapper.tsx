'use client';

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Separator } from '../ui/separator';
import BackButton from './back-button';
import Header from './header';
import Social from './social';

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    headerTitle: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

function CardWrapper({
    children,
    headerTitle,
    headerLabel,
    showSocial,
    backButtonLabel,
    backButtonHref,
}: CardWrapperProps) {
    return (
        <Card className='w-full md:w-[400px] shadow-md m-4'>
            <CardHeader>
                <Header label={headerLabel} title={headerTitle} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            {showSocial ? (
                <CardFooter className='flex flex-col space-y-2'>
                    <Separator />
                    <Social />
                </CardFooter>
            ) : null}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref} />
            </CardFooter>
        </Card>
    );
}

export default CardWrapper;
