import Orders from '@/components/protected/invoices/orders';

export default function Invoices() {
    return (
        <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
            <Orders />
        </main>
    );
}
