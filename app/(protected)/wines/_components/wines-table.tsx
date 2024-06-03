'use client';

import { GetWinesResponseType } from '@/app/api/wines/route';
import { DataTableColumnHeader } from '@/components/data-table/ColumnHeader';
import { DataTableViewOptions } from '@/components/data-table/ColumnToggle';
import { DataTableFacetedFilter } from '@/components/data-table/FacetedFilters';
import { Button } from '@/components/ui/button';
import SkeletonWrapper from '@/components/ui/skeleton-wrapper';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { WineType, wineTypeLabels } from '@/constants/wines';
import { Wine } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import RowActions from './row-actions';

const emptyData: any[] = [];

type WineRow = GetWinesResponseType[0];

const wineColors: { [key in WineType]: string } = {
    RED: '#961623',
    WHITE: '#f5e042',
    ROSE: '#f49ac1',
};

export const getWineTypeSVG = (type: WineType) => {
    const color = wineColors[type] || '#f49ac1';
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 64 64'
            width='16'
            height='16'
            className='mr-2'
        >
            <path
                fill={color}
                d='M15.1 22.1C16 30.1 23.3 37 32 37c9.4 0 17.1-8 17.1-16.7v-.2c-9.8-1.3-22.1 5.8-34 2'
            />
            <path
                fill='#a1b8c7'
                d='M54 20.4C54 9 48.3 2 48.3 2H15.7S10 9.1 10 20.4c0 10.8 9.3 20.9 20.9 21.5-.1 6.3-.7 12.8-2.2 15.1-2.2 3.2-9.8 1.6-9.8 5h26.2c0-3.4-7.6-1.8-9.8-5-1.5-2.3-2.1-8.8-2.2-15.1C44.7 41.3 54 31.3 54 20.4M32 39.3c-9.8 0-17.9-7.8-18.9-16.7-.1-.6-.1-1.3-.1-1.9 0-9.9 4.9-15.9 4.9-15.9h28.2s4.8 6 4.9 15.7v.2c0 9.6-8.5 18.6-19 18.6'
                opacity='.8'
            />
        </svg>
    );
};

const columns: ColumnDef<WineRow>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nom' />
        ),
        cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Type' />
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        cell: ({ row }) => (
            <div className='flex items-center'>
                {getWineTypeSVG(row.original.type as WineType)}
                {wineTypeLabels[row.original.type as WineType]}
            </div>
        ),
    },
    {
        accessorKey: 'region',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Région' />
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        cell: ({ row }) => <div>{row.original.region}</div>,
    },
    {
        accessorKey: 'year',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Année' />
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        cell: ({ row }) => <div>{row.original.year}</div>,
    },
    {
        accessorKey: 'price',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Prix' />
        ),
        cell: ({ row }) => <div>{row.original.price.toFixed(2)} €</div>,
    },
    {
        accessorKey: 'stock',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Stock' />
        ),
        cell: ({ row }) => <div>{row.original.stock}</div>,
    },
    {
        accessorKey: 'stock_alert',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Stock Alert' />
        ),
        cell: ({ row }) => <div>{row.original.stock_alert}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <RowActions wine={row.original} />,
    },
];

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

function WineTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const winesQuery = useQuery<GetWinesResponseType>({
        queryKey: ['wines'],
        queryFn: () => fetch(`/api/wines`).then((res) => res.json()),
    });

    const table = useReactTable({
        data: winesQuery.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleExportCSV = (data: Wine[]) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    const wineTypesOptions = useMemo(() => {
        const wineTypesMap = new Map();
        winesQuery.data?.forEach((wine: Wine) => {
            wineTypesMap.set(wine.type, {
                value: wine.type,
                label: wineTypeLabels[wine.type],
            });
        });
        const uniqueWineTypes = Array.from(wineTypesMap.values());
        return uniqueWineTypes.sort((a, b) => a.label.localeCompare(b.label));
    }, [winesQuery.data]);

    const wineRegionsOptions = useMemo(() => {
        const wineRegionsMap = new Map();
        winesQuery.data?.forEach((wine: Wine) => {
            wineRegionsMap.set(wine.region, {
                value: wine.region,
                label: wine.region,
            });
        });
        const uniqueWineRegions = Array.from(wineRegionsMap.values());
        return uniqueWineRegions.sort((a, b) => a.label.localeCompare(b.label));
    }, [winesQuery.data]);

    const wineYearsOptions = useMemo(() => {
        const wineYearsMap = new Map();
        winesQuery.data?.forEach((wine: Wine) => {
            wineYearsMap.set(wine.year, {
                value: wine.year,
                label: wine.year.toString(),
            });
        });
        const uniqueWineYears = Array.from(wineYearsMap.values());
        return uniqueWineYears.sort((a, b) => b.value - a.value);
    }, [winesQuery.data]);

    return (
        <div className='w-full'>
            <div className='flex flex-wrap items-end justify-between gap-2 py-4'>
                <div className='flex gap-2'>
                    {table.getColumn('type') && (
                        <DataTableFacetedFilter
                            title='Type'
                            column={table.getColumn('type')}
                            options={wineTypesOptions}
                        />
                    )}
                    {table.getColumn('region') && (
                        <DataTableFacetedFilter
                            title='Région'
                            column={table.getColumn('region')}
                            options={wineRegionsOptions}
                        />
                    )}
                    {table.getColumn('year') && (
                        <DataTableFacetedFilter
                            title='Année'
                            column={table.getColumn('year')}
                            options={wineYearsOptions}
                        />
                    )}
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button
                        variant={'outline'}
                        size={'sm'}
                        className='ml-auto h-8 lg:flex'
                        onClick={() => {
                            const data = table
                                .getFilteredRowModel()
                                .rows.map((row) => ({
                                    ...row.original,
                                }));
                            handleExportCSV(data);
                        }}
                    >
                        Export CSV
                    </Button>
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <div className='rounded-md border'>
                <SkeletonWrapper isLoading={winesQuery.isLoading}>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className='h-24 text-start md:text-center'
                                    >
                                        Pas de vins trouvés, commencez par en
                                        ajouter un ! 😉
                                    </TableCell>
                                </TableRow>
                            )}
                            {winesQuery.isRefetching && (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className='text-center'
                                    >
                                        <Loader2 className='animate-spin' />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </SkeletonWrapper>
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant='outline'
                    size='sm'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

export default WineTable;
