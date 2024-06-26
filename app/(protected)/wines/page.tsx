import CreateWineDialog from '@/components/protected/wines/create-wine-dialog';
import { Button } from '@/components/ui/button';
import { PlusSquare } from 'lucide-react';
import WinesTable from './_components/wines-table';

export default function Wines() {
    return (
        <main>
            <div className='container flex max-md:flex-col items-center justify-between gap-6 py-8'>
                <div>
                    <p className='text-3xl font-bold max-md:text-center'>
                        Gestion des vins
                    </p>
                </div>
                <CreateWineDialog
                    trigger={
                        <Button className='gap-2 text-sm'>
                            <PlusSquare className='h-4 w-4' />
                            Ajouter un vin
                        </Button>
                    }
                />
            </div>
            <div className='container'>
                <WinesTable />
            </div>
        </main>
    );
}
