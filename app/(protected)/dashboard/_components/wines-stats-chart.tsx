'use client';

import { GetWineSalesPeriodsResponseType } from '@/app/api/dashboard/wines-stats/route';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkeletonWrapper from '@/components/ui/skeleton-wrapper';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Period, Timeframe } from '@/types/chart';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import HistoryPeriodSelector from './history-period-selector';
import CustomTooltip from './pie-custom-tooltip';

interface WineSalesDataWithColors {
    wine: string;
    quantity: number;
    type: string;
    color: string;
}

function WineStatsPieChart() {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [timeframe, setTimeframe] = useState<Timeframe>('year');
    const [period, setPeriod] = useState<Period>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });

    const { data: wineSalesData, isFetching } =
        useQuery<GetWineSalesPeriodsResponseType>({
            queryKey: ['wines-stats', timeframe, period],
            queryFn: () =>
                fetch(
                    `/api/dashboard/wines-stats?year=${period.year}&month=${
                        timeframe === 'month' ? period.month : ''
                    }`
                ).then((res) => res.json()),
        });

    const dataAvailable = wineSalesData && wineSalesData.length > 0;

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }: {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        index: number;
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill='white'
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline='central'
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    if (!wineSalesData) return null;

    const wineSalesDataWithColors: WineSalesDataWithColors[] = wineSalesData
        ? wineSalesData.map((entry, index) => ({
              ...entry,
              color: COLORS[index % COLORS.length],
          }))
        : [];

    return (
        <div className='container py-2'>
            <h2 className='mt-4 md:mt-12 text-2xl max-md:text-center md:text-3xl font-bold'>
                Ventes par type de vin
            </h2>
            <p className='text-muted-foreground max-md:text-center'>
                Quantité facturée et payée uniquement
            </p>
            <Card className='col-span-12 mt-2 w-full md:w-1/2'>
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
                        {dataAvailable ? (
                            <ResponsiveContainer width='100%' height={300}>
                                <PieChart>
                                    <defs>
                                        {wineSalesDataWithColors.map(
                                            (entry, index) => (
                                                <linearGradient
                                                    id={`gradient-${index}`}
                                                    x1='0'
                                                    y1='0'
                                                    x2='0'
                                                    y2='1'
                                                    key={index}
                                                >
                                                    <stop
                                                        offset='0%'
                                                        stopColor={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                        stopOpacity={1}
                                                    />
                                                    <stop
                                                        offset='100%'
                                                        stopColor={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                        stopOpacity={0.2}
                                                    />
                                                </linearGradient>
                                            )
                                        )}
                                    </defs>
                                    <Pie
                                        data={wineSalesData}
                                        dataKey='quantity'
                                        nameKey='wine'
                                        cx='50%'
                                        cy='50%'
                                        outerRadius={100}
                                        fill='url(#paidBar)'
                                        label={renderCustomizedLabel}
                                        labelLine={false}
                                        stroke='#000'
                                    >
                                        {wineSalesData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`url(#gradient-${index})`}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        layout='vertical'
                                        verticalAlign={
                                            isDesktop ? 'middle' : 'top'
                                        }
                                        align={isDesktop ? 'left' : 'center'}
                                        formatter={(value, entry, index) => (
                                            <span
                                                style={{
                                                    color: wineSalesDataWithColors[
                                                        index
                                                    ].color,
                                                }}
                                                className='text-sm'
                                            >
                                                {value}
                                            </span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <Card className='flex max-md:text-center max-md:py-4 md:h-[300px] flex-col items-center justify-center bg-background max-md:px-4'>
                                Pas de ventes de vins enregistrées sur cette
                                période
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

export default WineStatsPieChart;

const COLORS = [
    '#10b981',
    '#ef4444',
    '#f59e0b',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f43f5e',
];
