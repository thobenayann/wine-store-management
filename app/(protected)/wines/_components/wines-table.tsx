'use client';

import { DataTableColumnHeader } from '@/components/data-table/ColumnHeader';
import { DataTableViewOptions } from '@/components/data-table/ColumnToggle';
import { DataTableFacetedFilter } from '@/components/data-table/FacetedFilters';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { wineData } from '@/data/fake-wine-data';
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
import { useMemo, useState } from 'react';

const columns: ColumnDef<any>[] = [
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
        cell: ({ row }) => <div>{row.original.type}</div>,
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
];

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

function WineTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: wineData,
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

    const handleExportCSV = (data: any[]) => {
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    const wineTypesOptions = useMemo(() => {
        const wineTypesMap = new Map();
        wineData.forEach((wine) => {
            wineTypesMap.set(wine.type, {
                value: wine.type,
                label: wine.type.charAt(0).toUpperCase() + wine.type.slice(1),
            });
        });
        const uniqueWineTypes = Array.from(new Set(wineTypesMap.values()));
        return uniqueWineTypes.sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const wineRegionsOptions = useMemo(() => {
        const wineRegionsMap = new Map();
        wineData.forEach((wine) => {
            wineRegionsMap.set(wine.region, {
                value: wine.region,
                label: wine.region,
            });
        });
        const uniqueWineRegions = Array.from(new Set(wineRegionsMap.values()));
        return uniqueWineRegions.sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const wineYearsOptions = useMemo(() => {
        const wineYearsMap = new Map();
        wineData.forEach((wine) => {
            wineYearsMap.set(wine.year, {
                value: wine.year,
                label: wine.year.toString(),
            });
        });
        const uniqueWineYears = Array.from(new Set(wineYearsMap.values()));
        return uniqueWineYears.sort((a, b) => b.value - a.value);
    }, []);

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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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
