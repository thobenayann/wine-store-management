'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkeletonWrapper from '@/components/ui/skeleton-wrapper';
import { cn } from '@/lib/utils';
import { Period, Timeframe } from '@/types/chart';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import CountUp from 'react-countup';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import HistoryPeriodSelector from './history-period-selector';

interface InvoiceData {
    date: string;
    PAID: number;
    PENDING: number;
}

function SalesChart() {
    const [timeframe, setTimeframe] = useState<Timeframe>('year');
    const [period, setPeriod] = useState<Period>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    const { data: salesData, isFetching } = useQuery<InvoiceData[]>({
        queryKey: ['sales', timeframe, period],
        queryFn: () =>
            fetch(
                `/api/dashboard/invoices?timeframe=${timeframe}&year=${
                    period.year
                }&month=${timeframe === 'month' ? period.month : ''}`
            ).then((res) => res.json()),
    });

    const chartData = useMemo(() => {
        if (!salesData) return [];

        if (timeframe === 'year') {
            return Array.from({ length: 12 }, (_, i) => {
                const monthStr = new Date(period.year, i).toLocaleDateString(
                    'default',
                    { month: 'long' }
                );
                const dataForMonth = salesData.find(
                    (data) => new Date(data.date).getMonth() === i
                );
                return {
                    date: monthStr,
                    PAID: dataForMonth ? dataForMonth.PAID : 0,
                    PENDING: dataForMonth ? dataForMonth.PENDING : 0,
                };
            });
        } else {
            const daysInMonth = new Date(
                period.year,
                period.month + 1,
                0
            ).getDate();
            return Array.from({ length: daysInMonth }, (_, i) => {
                const dayStr = (i + 1).toString();
                const dataForDay = salesData.find(
                    (data) => new Date(data.date).getDate() === i + 1
                );
                return {
                    date: dayStr,
                    PAID: dataForDay ? dataForDay.PAID : 0,
                    PENDING: dataForDay ? dataForDay.PENDING : 0,
                };
            });
        }
    }, [salesData, timeframe, period]);

    const dataAvailable = chartData.some(
        (data) => data.PAID !== 0 || data.PENDING !== 0
    );

    return (
        <div className='container py-2'>
            <h2 className='mt-4 md:mt-12 text-2xl max-md:text-center md:text-3xl font-bold'>
                Ventes
            </h2>
            <p className='text-muted-foreground max-md:text-center'>
                Données provenant des factures (montants hors taxes)
            </p>
            <Card className='col-span-12 mt-2 w-full'>
                <CardHeader className='gap-2'>
                    <CardTitle className='grid grid-flow-row justify-between gap-2 md:grid-flow-col'>
                        <HistoryPeriodSelector
                            period={period}
                            setPeriod={setPeriod}
                            timeframe={timeframe}
                            setTimeframe={setTimeframe}
                        />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <SkeletonWrapper isLoading={isFetching}>
                        {dataAvailable && (
                            <ResponsiveContainer width='100%' height={300}>
                                <BarChart
                                    height={300}
                                    data={chartData}
                                    barCategoryGap={5}
                                >
                                    <defs>
                                        <linearGradient
                                            id='paidBar'
                                            x1='0'
                                            y1='0'
                                            x2='0'
                                            y2='1'
                                        >
                                            <stop
                                                offset='0'
                                                stopColor='#10b981'
                                                stopOpacity='1'
                                            />
                                            <stop
                                                offset='1'
                                                stopColor='#10b981'
                                                stopOpacity='0'
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id='pendingBar'
                                            x1='0'
                                            y1='0'
                                            x2='0'
                                            y2='1'
                                        >
                                            <stop
                                                offset='0'
                                                stopColor='#ef4444'
                                                stopOpacity='1'
                                            />
                                            <stop
                                                offset='1'
                                                stopColor='#ef4444'
                                                stopOpacity='0'
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray='5 5'
                                        strokeOpacity='0.2'
                                        vertical={false}
                                    />
                                    <XAxis
                                        stroke='#888888'
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        padding={{ left: 5, right: 5 }}
                                        dataKey='date'
                                    />
                                    <YAxis
                                        stroke='#888888'
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Bar
                                        dataKey='PAID'
                                        label='Paid'
                                        fill='url(#paidBar)'
                                        radius={4}
                                        className='cursor-pointer'
                                    />
                                    <Bar
                                        dataKey='PENDING'
                                        label='Pending'
                                        fill='url(#pendingBar)'
                                        radius={4}
                                        className='cursor-pointer'
                                    />
                                    <Tooltip
                                        cursor={{ opacity: 0.1 }}
                                        content={<CustomTooltip />}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        {!dataAvailable && (
                            <Card className='flex max-md:text-center max-md:py-4 md:h-[300px] flex-col items-center justify-center bg-background max-md:px-4'>
                                Pas de données sur les ventes de la période
                                choisie
                                <p className='text-sm text-muted-foreground'>
                                    Essayez de sélectionner une autre période
                                </p>
                            </Card>
                        )}
                    </SkeletonWrapper>
                </CardContent>
            </Card>
        </div>
    );
}

export default SalesChart;

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const { PAID, PENDING } = data;

    return (
        <div className='min-w-[200px] md:min-w-[300px] rounded border bg-background p-4'>
            <TooltipRow
                label='Payées'
                value={PAID}
                bgColor='bg-emerald-500'
                textColor='text-emerald-500'
            />
            <TooltipRow
                label='En attente'
                value={PENDING}
                bgColor='bg-red-500'
                textColor='text-red-500'
            />
            <TooltipRow
                label='Balance'
                value={PAID - PENDING}
                bgColor='bg-gray-100'
                textColor='text-foreground'
            />
        </div>
    );
}

function TooltipRow({
    label,
    value,
    bgColor,
    textColor,
}: {
    label: string;
    value: number;
    bgColor: string;
    textColor: string;
}) {
    const formattingFn = useCallback(
        (value: number) =>
            new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value),
        []
    );

    return (
        <div className='flex items-center gap-2'>
            <div className={cn('h-4 w-4 rounded-full', bgColor)} />
            <div className='flex w-full justify-between'>
                <p className='text-sm text-muted-foreground'>{label}</p>
                <div className={cn('text-sm font-bold', textColor)}>
                    <CountUp
                        duration={0.5}
                        preserveValue
                        end={value}
                        decimals={2}
                        formattingFn={formattingFn}
                        className='text-sm'
                    />
                </div>
            </div>
        </div>
    );
}
