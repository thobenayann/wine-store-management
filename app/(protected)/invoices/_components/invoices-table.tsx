'use client';

import { GetInvoicesResponseType } from '@/app/api/invoices/route';
import { DataTableColumnHeader } from '@/components/data-table/ColumnHeader';
import { DataTableFacetedFilter } from '@/components/data-table/FacetedFilters';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PayedSwitch } from '@/components/ui/payed-switch';
import SkeletonWrapper from '@/components/ui/skeleton-wrapper';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/helpers';
import { Customer } from '@prisma/client';
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
import { useMemo, useState } from 'react';
import RowInvoiceActions from './row-invoice-actions';

const emptyData: any[] = [];

const columns: ColumnDef<GetInvoicesResponseType[0]>[] = [
    {
        accessorKey: 'client',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Client' />
        ),
        cell: ({ row }) => (
            <div>
                <div className='font-medium'>
                    {row.original.client.first_name}{' '}
                    {row.original.client.last_name}
                </div>
                <div className='hidden text-sm text-muted-foreground md:inline'>
                    {row.original.client.email}
                </div>
            </div>
        ),
        filterFn: (row, id, value) => {
            const client = row.getValue<Customer>(id);
            return (
                client.first_name.toLowerCase().includes(value.toLowerCase()) ||
                client.last_name.toLowerCase().includes(value.toLowerCase()) ||
                client.email.toLowerCase().includes(value.toLowerCase())
            );
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Statut' />
        ),
        cell: ({ row }) => (
            <PayedSwitch
                invoiceId={row.original.id}
                status={row.original.status}
                initialIsOn={row.original.status === 'PENDING'}
            />
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: ({ row }) =>
            new Date(row.original.created_at).toLocaleDateString(),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: 'due_date',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Échéance' />
        ),
        cell: ({ row }) => new Date(row.original.due_date).toLocaleDateString(),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
        accessorKey: 'total',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Montant HT' />
        ),
        cell: ({ row }) => `${formatCurrency(row.original.total)}`,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
            <div className='flex items-center gap-2'>
                <RowInvoiceActions invoice={row.original} />
            </div>
        ),
    },
];

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const InvoicesTable = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const {
        data: invoices,
        isLoading,
        error,
    } = useQuery<GetInvoicesResponseType>({
        queryKey: ['invoices'],
        queryFn: () => fetch(`/api/invoices`).then((res) => res.json()),
    });

    const table = useReactTable({
        data: invoices || emptyData,
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

    const handleExportCSV = (data: GetInvoicesResponseType) => {
        const csvData = data.map((invoice) => {
            const createdAt = new Date(invoice.created_at);
            const updatedAt = new Date(invoice.updated_at);
            const dueDate = new Date(invoice.due_date);
            return {
                created_at: createdAt.toLocaleDateString(),
                due_date: dueDate.toLocaleDateString(),
                total: invoice.total,
                client_first_name: invoice.client.first_name,
                client_last_name: invoice.client.last_name,
                client_email: invoice.client.email,
                status: invoice.status,
            };
        });
        const csv = generateCsv(csvConfig)(csvData);
        download(csvConfig)(csv);
    };

    const statusOptions = useMemo(
        () => [
            { label: 'En cours', value: 'PENDING' },
            { label: 'Payée', value: 'PAID' },
        ],
        []
    );

    if (error) {
        return <div>Error loading invoices: {error.message}</div>;
    }

    return (
        <Card>
            <CardHeader className='px-7'>
                <CardTitle>Factures</CardTitle>
                <CardDescription>
                    Factures récentes de votre magasin.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='flex flex-wrap items-end justify-between gap-2 py-4'>
                    <div className='flex gap-2'>
                        {table.getColumn('status') && (
                            <DataTableFacetedFilter
                                title='Statut'
                                column={table.getColumn('status')}
                                options={statusOptions}
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
                    </div>
                </div>
                <SkeletonWrapper isLoading={isLoading}>
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
                                        className='text-center'
                                    >
                                        Aucune facture trouvée.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </SkeletonWrapper>
            </CardContent>
        </Card>
    );
};

export default InvoicesTable;
