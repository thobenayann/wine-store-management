'use client';

import { GetHistoryPeriodsResponseType } from '@/app/api/dashboard/history-period/route';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import SkeletonWrapper from '@/components/ui/skeleton-wrapper';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Period, Timeframe } from '@/types/chart';
import { useQuery } from '@tanstack/react-query';

interface Props {
    period: Period;
    setPeriod: (period: Period) => void;
    timeframe: Timeframe;
    setTimeframe: (timeframe: Timeframe) => void;
}

function HistoryPeriodSelector({
    period,
    setPeriod,
    timeframe,
    setTimeframe,
}: Props) {
    const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
        queryKey: ['history-period'],
        queryFn: () =>
            fetch(`/api/dashboard/history-period`).then((res) => res.json()),
    });

    return (
        <div className='flex flex-wrap items-center gap-4'>
            <SkeletonWrapper
                isLoading={historyPeriods.isFetching}
                fullWidth={false}
            >
                <Tabs
                    value={timeframe}
                    onValueChange={(value) => setTimeframe(value as Timeframe)}
                >
                    <TabsList>
                        <TabsTrigger value='year'>Year</TabsTrigger>
                        <TabsTrigger value='month'>Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            </SkeletonWrapper>
            <div className='flex flex-wrap items-center gap-2'>
                <SkeletonWrapper
                    isLoading={historyPeriods.isFetching}
                    fullWidth={false}
                >
                    <YearSelector
                        period={period}
                        setPeriod={setPeriod}
                        years={historyPeriods.data || []}
                    />
                </SkeletonWrapper>
                {timeframe === 'month' && (
                    <SkeletonWrapper
                        isLoading={historyPeriods.isFetching}
                        fullWidth={false}
                    >
                        <MonthSelector period={period} setPeriod={setPeriod} />
                    </SkeletonWrapper>
                )}
            </div>
        </div>
    );
}

export default HistoryPeriodSelector;

function YearSelector({
    period,
    setPeriod,
    years,
}: {
    period: Period;
    setPeriod: (period: Period) => void;
    years: number[];
}) {
    return (
        <Select
            value={period.year.toString()}
            onValueChange={(value) =>
                setPeriod({ month: period.month, year: parseInt(value) })
            }
        >
            <SelectTrigger className='w-[180px]'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function MonthSelector({
    period,
    setPeriod,
}: {
    period: Period;
    setPeriod: (period: Period) => void;
}) {
    return (
        <Select
            value={period.month.toString()}
            onValueChange={(value) =>
                setPeriod({ year: period.year, month: parseInt(value) })
            }
        >
            <SelectTrigger className='w-[180px]'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
                    const monthStr = new Date(
                        period.year,
                        month,
                        1
                    ).toLocaleString('default', { month: 'long' });
                    return (
                        <SelectItem
                            key={month}
                            value={month.toString()}
                            className='first-letter:uppercase'
                        >
                            {monthStr.charAt(0).toUpperCase() +
                                monthStr.slice(1)}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
