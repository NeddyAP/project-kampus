import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import { ChevronDown, ChevronUp, Plus, Search, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from 'react';
import { PaginationLink } from '@/types';
import { useDebounce } from '@/hooks/use-debounce';

interface CreateButtonOptions {
  href: string;
  text: string;
  icon?: React.ReactNode;
  show?: boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
  };
  searchable?: boolean;
  searchPlaceholder?: string;
  searchParam?: string; // URL param name for search query
  filters?: Record<string, string>;
  defaultSort?: SortingState;
  createButton?: CreateButtonOptions;
}

const rowCountOptions = [10, 25, 50, 100];

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  searchable = true,
  searchPlaceholder = "Cari...",
  searchParam = "search",
  filters = {},
  defaultSort = [],
  createButton,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSort);
  const [searchQuery, setSearchQuery] = useState<string>(filters[searchParam] || "");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Default create button props if not provided
  const defaultCreateButton: CreateButtonOptions = {
    href: "#",
    text: "Tambah Baru",
    icon: <Plus className="mr-2 h-4 w-4" />,
    show: false
  };

  // Merge provided create button props with defaults
  const createButtonProps = { ...defaultCreateButton, ...createButton };

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
      handleFiltersChange(searchParam, debouncedSearchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePerPageChange = (value: string) => {
    handleFiltersChange('per_page', value);
  };

  const handleFiltersChange = (key: string, value: string) => {
    const url = new URL(window.location.href);

    // Keep existing filters except pagination when changing filters
    if (key !== 'page') {
      url.searchParams.delete('page');
    }

    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }

    router.get(url.toString(), {}, { preserveState: true, preserveScroll: true });
  };

  const clearSearch = () => {
    setSearchQuery("");
    handleFiltersChange(searchParam, "");
  };

  const SortingIcon = ({ isSorted }: { isSorted: false | 'asc' | 'desc' }) => {
    if (!isSorted) return null;
    return isSorted === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      {(searchable || createButtonProps.show) && (
        <div className="flex items-center gap-4 justify-between flex-wrap">
          {searchable && (
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-10 w-full"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                  aria-label="Hapus pencarian"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {createButtonProps.show && (
            <Button asChild className="whitespace-nowrap">
              <Link href={createButtonProps.href}>
                {createButtonProps.icon}
                {createButtonProps.text}
              </Link>
            </Button>
          )}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      {header.column.getCanSort() && (
                        <SortingIcon isSorted={header.column.getIsSorted()} />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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

      {pagination && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Total {pagination.total} data
          </p>
          <div className="flex items-center space-x-2">
            {pagination.links.map((link, i) => {
              // Skip rendering if url is null or undefined
              if (link.url === null || link.url === undefined) return null;

              return (
                <Button
                  key={i}
                  variant={link.active ? "default" : "outline"}
                  asChild
                >
                  <Link
                    href={link.url}
                    preserveScroll
                    preserveState
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {pagination && (
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tampilkan</span>
            <Select
              value={pagination.per_page.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={pagination.per_page.toString()} />
              </SelectTrigger>
              <SelectContent>
                {rowCountOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">data</span>
          </div>
        </div>
      )}
    </div>
  );
}
