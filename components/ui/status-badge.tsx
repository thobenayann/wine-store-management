import { cn } from '@/lib/utils';
import * as React from 'react';

interface StatusBadgeProps {
    status: keyof typeof statusColor;
    children: React.ReactNode;
}

export const statusColor = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    FULFILLED: 'bg-emerald-100 text-emerald-800',
    INVOICED: 'bg-purple-100 text-purple-800',
    CANCELLED: 'bg-red-100 text-red-800',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
    const colorClass = statusColor[status];
    return (
        <div
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                colorClass
            )}
        >
            {children}
        </div>
    );
};

export default StatusBadge;
