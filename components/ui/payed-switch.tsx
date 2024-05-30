'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface PayedSwitchProps {
    status: 'Payée' | 'En cours';
    initialIsOn?: boolean;
}

export function PayedSwitch({ status, initialIsOn = false }: PayedSwitchProps) {
    const [isOn, setIsOn] = useState(initialIsOn);

    const toggleSwitch = () => {
        setIsOn(!isOn);
    };

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
