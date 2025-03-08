import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PaginationControls } from './pagination-controls';
import { Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';

const PAGE_SIZES = [10, 25, 50, 100];

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface CreateButton {
    href: string;
    text: string;
    icon?: React.ReactNode;
    show?: boolean;
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchable?: boolean;
    searchPlaceholder?: string;
    searchColumn?: string;
    searchParam?: string;
    pagination?: Pagination;
    filters?: Record<string, string>;
    createButton?: CreateButton;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchable = false,
    searchPlaceholder = 'Cari...',
    searchColumn = 'name',
    searchParam = 'search',
    pagination,
    filters = {},
    createButton,
}: DataTableProps<TData, TValue>) {
    // Client-side state
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // Use server-side pagination if provided
    const isServerSide = Boolean(pagination);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        manualPagination: isServerSide,
        pageCount: isServerSide && pagination ? pagination.last_page : undefined,
        state: {
            sorting,
            columnFilters,
            pagination: isServerSide && pagination
                ? { pageIndex: pagination.current_page - 1, pageSize: pagination.per_page }
                : { pageIndex, pageSize },
        },
    });

    const handleSearch = (value: string) => {
        if (isServerSide) {
            router.get(window.location.pathname, {
                ...filters,
                [searchParam]: value,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            table.getColumn(searchColumn)?.setFilterValue(value);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between py-4">
                {searchable && (
                    <Input
                        placeholder={searchPlaceholder}
                        value={isServerSide ? filters[searchParam] || '' : (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
                        onChange={(event) => handleSearch(event.target.value)}
                        className="max-w-sm"
                    />
                )}

                {!isServerSide && (
                    <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">
                            Tampilkan
                        </p>
                        <Select
                            value={table.getState().pagination.pageSize.toString()}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {PAGE_SIZES.map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">data</p>
                    </div>
                )}

                {createButton?.show && (
                    <Button asChild>
                        <Link href={createButton.href}>
                            {createButton.icon || <Plus className="mr-2 h-4 w-4" />}
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
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Total {isServerSide && pagination ? pagination.total : table.getFilteredRowModel().rows.length} data
                </div>
                {isServerSide && pagination ? (
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            {pagination.links.map((link, i) => {
                                // Skip prev/next buttons as we'll create our own
                                if (i === 0 || i === pagination.links.length - 1) return null;

                                return (
                                    <Button
                                        key={link.label}
                                        variant={link.active ? 'default' : 'outline'}
                                        className="h-8 w-8 p-0"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                    >
                                        <span>{link.label}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <PaginationControls table={table} />
                )}
            </div>
        </div>
    );
}