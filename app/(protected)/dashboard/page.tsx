import { getCurrentUserSession } from '@/lib/getSession';
import SalesChart from './_components/sales-chart';

export default async function Dashboard() {
    const session = await getCurrentUserSession();

    return (
        <main>
            <div className='container flex max-md:flex-col items-center justify-between gap-6 py-8 border-b bg-card'>
                <div>
                    <p className='text-3xl font-bold max-md:text-center'>
                        {`Hello ${session?.user?.firstName ?? ''} 👋`}
                    </p>
                </div>
            </div>
            <div className='md:container'>
                <SalesChart />
            </div>
        </main>
    );
}
