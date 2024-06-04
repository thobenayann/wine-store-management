'use client';

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
import { download, generateCsv } from 'export-to-csv';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';

type CustomerRow = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    adresse: string;
    company?: string;
};

const columns: ColumnDef<CustomerRow>[] = [
    {
        accessorKey: 'first_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Prénom' />
        ),
        cell: ({ row }) => <div>{row.original.first_name}</div>,
    },
    {
        accessorKey: 'last_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Nom' />
        ),
        cell: ({ row }) => <div>{row.original.last_name}</div>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Email' />
        ),
        cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Téléphone' />
        ),
        cell: ({ row }) => <div>{row.original.phone}</div>,
    },
    {
        accessorKey: 'adresse',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Adresse' />
        ),
        cell: ({ row }) => <div>{row.original.adresse}</div>,
    },
    {
        accessorKey: 'company',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Entreprise' />
        ),
        cell: ({ row }) => <div>{row.original.company || 'N/A'}</div>,
    },
];

const emptyData: CustomerRow[] = [];

function CustomerTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const customersQuery = useQuery<CustomerRow[]>({
        queryKey: ['customers'],
        queryFn: () => fetch(`/api/customers`).then((res) => res.json()),
    });

    const table = useReactTable({
        data: customersQuery.data || emptyData,
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

    const handleExportCSV = (data: CustomerRow[]) => {
        const csvConfig = {
            fieldSeparator: ',',
            decimalSeparator: '.',
            useKeysAsHeaders: true,
        };
        const csv = generateCsv(csvConfig)(data);
        download(csvConfig)(csv);
    };

    const companyOptions = useMemo(() => {
        const companyMap = new Map();
        customersQuery.data?.forEach((customer) => {
            if (customer.company) {
                companyMap.set(customer.company, {
                    value: customer.company,
                    label: customer.company,
                });
            }
        });
        const uniqueCompanies = Array.from(companyMap.values());
        return uniqueCompanies.sort((a, b) => a.label.localeCompare(b.label));
    }, [customersQuery.data]);

    return (
        <div className='w-full'>
            <div className='flex flex-wrap items-end justify-between gap-2 py-4'>
                <div className='flex gap-2'>
                    {table.getColumn('company') && (
                        <DataTableFacetedFilter
                            title='Entreprise'
                            column={table.getColumn('company')}
                            options={companyOptions}
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
                <SkeletonWrapper isLoading={customersQuery.isLoading}>
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
                                        Pas encore de client référencé.
                                        Commencez par en ajouter un ! 😉
                                    </TableCell>
                                </TableRow>
                            )}
                            {customersQuery.isRefetching && (
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

export default CustomerTable;
