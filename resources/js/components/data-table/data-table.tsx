import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
    showColumnVisibility?: boolean;
    searchColumn?: string;
    searchable?: boolean;
    searchParam?: string;
    filters?: Record<string, string>;
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    createButton?: {
        href: string;
        text: string;
        icon?: React.ReactNode;
        show?: boolean;
    };
    defaultSort?: { id: string; desc: boolean };
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = 'Cari...',
    showColumnVisibility = true,
    searchColumn = 'title',
    searchable = true,
    searchParam = 'search',
    filters = {},
    pagination,
    createButton,
    defaultSort,
}: DataTableProps<TData, TValue>) {
    // Initialize sorting with default value if provided
    const initialSorting: SortingState = defaultSort ? [defaultSort] : [];
    const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    const filterableColumns = table.getAllColumns().filter((column) => {
        const columnDef = column.columnDef as ColumnDef<TData, TValue>;
        return columnDef.enableColumnFilter !== false;
    });

    const searchableColumn = searchColumn ? table.getColumn(searchColumn) : filterableColumns[0];

    const handleSearch = (value: string) => {
        if (searchableColumn) {
            searchableColumn.setFilterValue(value);
        }
    };

    const updatePageUrl = (page: number) => {
        const url = new URL(window.location.href);
        if (page > 1) {
            url.searchParams.set('page', page.toString());
        } else {
            url.searchParams.delete('page');
        }
        window.history.pushState({}, '', url.toString());
    };

    // Helper to render sort indicator icon
    const getSortIcon = (column: any) => {
        if (!column.getCanSort()) return null;

        if (column.getIsSorted() === 'asc') {
            return <ArrowUp className="ml-2 h-4 w-4" />;
        }
        if (column.getIsSorted() === 'desc') {
            return <ArrowDown className="ml-2 h-4 w-4" />;
        }
        return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    {searchable && (
                        <Input
                            placeholder={searchPlaceholder}
                            value={(searchableColumn?.getFilterValue() as string) ?? ''}
                            onChange={(event) => handleSearch(event.target.value)}
                            className="max-w-sm"
                        />
                    )}

                    {showColumnVisibility && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Kolom <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.columnDef.header as string}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {createButton?.show && (
                    <Button asChild>
                        <Link href={createButton.href}>
                            {createButton.icon}
                            {createButton.text}
                        </Link>
                    </Button>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canSort = header.column.getCanSort();
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className: canSort ? 'cursor-pointer select-none flex items-center gap-1' : '',
                                                        onClick: canSort ? header.column.getToggleSortingHandler() : undefined,
                                                    }}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {getSortIcon(header.column)}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Tidak ada data.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-muted-foreground flex-1 text-sm">
                        Menampilkan {pagination.current_page} dari {pagination.last_page} halaman ({pagination.total} total data)
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (pagination.current_page > 1) {
                                    updatePageUrl(pagination.current_page - 1);
                                }
                            }}
                            disabled={pagination.current_page <= 1}
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                if (pagination.current_page < pagination.last_page) {
                                    updatePageUrl(pagination.current_page + 1);
                                }
                            }}
                            disabled={pagination.current_page >= pagination.last_page}
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
