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
        <div className='flex items-center space-x-2'>
            <Switch
                id='invoice-status'
                checked={isOn}
                onChange={toggleSwitch}
            />
            <Label htmlFor='invoice-status'>{status}</Label>
        </div>
    );
}
