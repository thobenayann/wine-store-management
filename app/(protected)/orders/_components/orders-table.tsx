'use client';

import { DataTableColumnHeader } from '@/components/data-table/ColumnHeader';
import { DataTableViewOptions } from '@/components/data-table/ColumnToggle';
import { Button } from '@/components/ui/button';
import SkeletonWrapper from '@/components/ui/skeleton-wrapper';
import StatusBadge from '@/components/ui/status-badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useMediaQuery } from '@/hooks/use-media-query';
import { translateOrderStatus } from '@/lib/helpers';
import { Order } from '@/schemas';
import { useQuery } from '@tanstack/react-query';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Redo2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import RowOrderActions from './row-order-actions';

const columns: ColumnDef<Order>[] = [
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Date de Création' />
        ),
        cell: ({ row }) =>
            new Date(row.original.created_at).toLocaleDateString(),
    },
    {
        accessorKey: 'client',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Client' />
        ),
        cell: ({ row }) =>
            `${row.original.client.first_name} ${row.original.client.last_name}`,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Statut' />
        ),
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <StatusBadge status={status}>
                    {translateOrderStatus(status)}
                </StatusBadge>
            );
        },
    },
    {
        accessorKey: 'total',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Total HT' />
        ),
        cell: ({ row }) => {
            const total = row.original.lines.reduce(
                (acc, line) => acc + line.total,
                0
            );
            return `${total.toFixed(2)} €`;
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
            <div className='flex items-center gap-2'>
                <RowOrderActions order={row.original} />
            </div>
        ),
    },
];

const OrderTable = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const isDesktop = useMediaQuery('(min-width: 768px)');

    const ordersQuery = useQuery<Order[]>({
        queryKey: ['orders'],
        queryFn: () => fetch('/api/orders').then((res) => res.json()),
    });

    const table = useReactTable<Order>({
        data: ordersQuery.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className='w-full'>
            <div className='flex flex-wrap items-end justify-between gap-2 py-4'>
                <div className='flex flex-wrap gap-2'>
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <div className='rounded-md border'>
                <SkeletonWrapper isLoading={ordersQuery.isLoading}>
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
                                        colSpan={
                                            isDesktop
                                                ? columns.length
                                                : undefined
                                        }
                                        className='h-24'
                                    >
                                        <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-4 md:p-6'>
                                            <div className='flex flex-col items-center gap-3 text-center'>
                                                <h3 className='text-2xl font-bold tracking-tight'>
                                                    Vous n&apos;avez pas encore
                                                    de commandes
                                                </h3>
                                                <p className='text-sm text-muted-foreground'>
                                                    Commencez par ajouter des
                                                    clients et des vins pour
                                                    pouvoir saisir des commandes
                                                </p>
                                                <div className='container flex max-md:flex-col max-md:gap-y-4 md:gap-x-6 justify-center items-center'>
                                                    <Button
                                                        className='gap-2 text-sm'
                                                        asChild
                                                    >
                                                        <Link
                                                            href={'/customers'}
                                                        >
                                                            <Redo2 className='h-4 w-4' />
                                                            Vers vos clients
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        className='gap-2 text-sm'
                                                        asChild
                                                    >
                                                        <Link href={'/wines'}>
                                                            <Redo2 className='h-4 w-4' />
                                                            Vers les vins
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
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
};

export default OrderTable;
