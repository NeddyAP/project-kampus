import { useDebounce } from '@/hooks/use-debounce';
import { Link, router } from '@inertiajs/react';
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
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { PaginationControls } from './pagination-controls';

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
    const [searchQuery, setSearchQuery] = useState<string>(filters[searchParam] || '');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Use server-side pagination if provided
    const isServerSide = Boolean(pagination);

    // Update search query from filters on initial load
    useEffect(() => {
        if (filters[searchParam] && filters[searchParam] !== searchQuery) {
            setSearchQuery(filters[searchParam]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle search query changes
    useEffect(() => {
        if (debouncedSearchQuery !== undefined) {
            handleSearch(debouncedSearchQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchQuery]);

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
            pagination:
                isServerSide && pagination ? { pageIndex: pagination.current_page - 1, pageSize: pagination.per_page } : { pageIndex, pageSize },
        },
    });

    const handleSearch = (value: string) => {
        if (isServerSide) {
            const updatedFilters = { ...filters };

            if (value) {
                updatedFilters[searchParam] = value;
            } else {
                delete updatedFilters[searchParam];
            }

            // Reset to page 1 when searching
            delete updatedFilters.page;

            router.get(window.location.pathname, updatedFilters, {
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            table.getColumn(searchColumn)?.setFilterValue(value);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        handleSearch('');
    };

    // Handle pagination navigation
    const handlePageNavigation = (url: string) => {
        // Extract the page number from the URL
        const urlObj = new URL(url);
        const page = urlObj.searchParams.get('page');

        // Create a new filters object with all current filters
        const updatedFilters = { ...filters };

        if (page) {
            updatedFilters.page = page;
        }

        router.get(window.location.pathname, updatedFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle direct page navigation
    const handleDirectPageNavigation = (page: number) => {
        // Create a new filters object with all current filters
        const updatedFilters = { ...filters };
        updatedFilters.page = page.toString();

        router.get(window.location.pathname, updatedFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle per-page change
    const handlePerPageChange = (value: string) => {
        // Create a new filters object with all current filters
        const updatedFilters = { ...filters };

        // Update per_page and reset to page 1
        updatedFilters.per_page = value;
        delete updatedFilters.page;

        router.get(window.location.pathname, updatedFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4 py-4">
                {searchable && (
                    <div className="relative max-w-sm flex-grow">
                        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            className="w-full pr-10 pl-8"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2"
                                aria-label="Hapus pencarian"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                    {isServerSide && (
                        <div className="flex items-center space-x-2">
                            <p className="text-muted-foreground text-sm">Tampilkan</p>
                            <Select value={(pagination?.per_page || 10).toString()} onValueChange={handlePerPageChange}>
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
                            <p className="text-muted-foreground text-sm">data</p>
                        </div>
                    )}

                    {!isServerSide && (
                        <div className="flex items-center space-x-2">
                            <p className="text-muted-foreground text-sm">Tampilkan</p>
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
                            <p className="text-muted-foreground text-sm">data</p>
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
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
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
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    Total {isServerSide && pagination ? pagination.total : table.getFilteredRowModel().rows.length} data
                </div>
                {isServerSide && pagination ? (
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            {/* First page button */}
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDirectPageNavigation(1)}
                                disabled={pagination.current_page === 1}
                            >
                                <span className="sr-only">Halaman pertama</span>
                                <ChevronFirst className="h-4 w-4" />
                            </Button>

                            {/* Previous page button */}
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDirectPageNavigation(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                            >
                                <span className="sr-only">Halaman sebelumnya</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {/* Page number buttons */}
                            {pagination.links.map((link, i) => {
                                // Skip prev/next buttons as we have our own
                                if (i === 0 || i === pagination.links.length - 1) return null;

                                return (
                                    <Button
                                        key={link.label}
                                        variant={link.active ? 'default' : 'outline'}
                                        className="h-8 w-8 p-0"
                                        disabled={!link.url}
                                        onClick={() => link.url && handlePageNavigation(link.url)}
                                    >
                                        <span>{link.label}</span>
                                    </Button>
                                );
                            })}

                            {/* Next page button */}
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDirectPageNavigation(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                            >
                                <span className="sr-only">Halaman berikutnya</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            {/* Last page button */}
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDirectPageNavigation(pagination.last_page)}
                                disabled={pagination.current_page === pagination.last_page}
                            >
                                <span className="sr-only">Halaman terakhir</span>
                                <ChevronLast className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <PaginationControls table={table} />
                )}
            </div>
        </div>
    );
}
