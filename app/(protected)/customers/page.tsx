import CreateCustomerDialog from '@/components/protected/customers/create-customer-dialog';
import { Button } from '@/components/ui/button';
import { PlusSquare } from 'lucide-react';
import UserTable from './_components/customer-table';

export default function Customers() {
    return (
        <main>
            <div className='container flex flex-wrap items-center justify-between gap-6 py-8'>
                <div>
                    <p className='text-3xl font-bold'>Gestion des clients</p>
                </div>
                <CreateCustomerDialog
                    trigger={
                        <Button className='gap-2 text-sm'>
                            <PlusSquare className='h-4 w-4' />
                            Ajouter un client
                        </Button>
                    }
                />
            </div>
            <div className='container'>
                <UserTable />
            </div>
        </main>
    );
}
