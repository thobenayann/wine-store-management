'use client';

import { updateInvoiceStatus } from '@/actions/invoices';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { InvoiceStatus } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PayedSwitchProps {
    invoiceId: string;
    status: InvoiceStatus;
    initialIsOn?: boolean;
}

type PayedSwitchStatus = 'PAID' | 'PENDING';

export function PayedSwitch({
    invoiceId,
    status,
    initialIsOn = false,
}: PayedSwitchProps) {
    const [isOn, setIsOn] = useState(initialIsOn);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (status === 'PAID' || status === 'PENDING') {
            setIsOn(status === 'PAID');
        }
    }, [status]);

    const mutation = useMutation({
        mutationFn: (newStatus: PayedSwitchStatus) =>
            updateInvoiceStatus(invoiceId, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['invoices', invoiceId],
            });
            queryClient.invalidateQueries({
                queryKey: ['wines-stats', 'year', 'month'],
            });
            toast.success(
                `Le statut de la facture a été mis à jour avec succès`
            );
        },
        onError: () => {
            toast.error(
                'Erreur lors de la mise à jour du statut de la facture'
            );
        },
    });

    const toggleSwitch = () => {
        const newStatus: PayedSwitchStatus = isOn ? 'PENDING' : 'PAID';
        setIsOn(!isOn);
        mutation.mutate(newStatus);
    };

    if (status !== 'PAID' && status !== 'PENDING') {
        return null; // Render nothing if status is not PAID or PENDING
    }

    return (
        <div className='flex max-md:flex-col max-md:space-y-2 max-md:justify-center items-center md:space-x-2'>
            <Switch id='invoice-status' checked={isOn} onClick={toggleSwitch} />
            <Label
                className='max-md:text-center text-xs md:text-sm'
                htmlFor='invoice-status'
            >
                {isOn ? 'Payée' : 'En cours'}
            </Label>
        </div>
    );
}
