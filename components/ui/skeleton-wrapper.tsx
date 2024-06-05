import { cn } from '@/lib/utils';
import React from 'react';
import { Skeleton } from './skeleton';

interface SkeletonWrapperProps {
    children: React.ReactNode;
    isLoading: boolean;
    fullWidth?: boolean;
}

function SkeletonWrapper({
    children,
    isLoading,
    fullWidth = true,
}: SkeletonWrapperProps) {
    if (!isLoading) return children;

    return (
        <Skeleton className={cn(fullWidth && 'w-full')}>
            <div className='opacity-0'>{children}</div>
        </Skeleton>
    );
}

export default SkeletonWrapper;
