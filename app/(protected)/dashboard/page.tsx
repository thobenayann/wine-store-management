import { getCurrentUserSession } from '@/lib/getSession';
import LastOrdersTable from './_components/last-orders-table';
import SalesChart from './_components/sales-chart';
import WineStatsPieChart from './_components/wines-stats-pie-chart';

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
            <div className='md:container max-md:space-y-6 pb-12'>
                <SalesChart />
                <div className='flex max-md:flex-col max-md:space-y-6 max-md:border-t-2 max-md:border-dashed'>
                    <WineStatsPieChart />
                    <LastOrdersTable />
                </div>
            </div>
        </main>
    );
}
