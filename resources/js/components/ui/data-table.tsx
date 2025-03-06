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
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
      url?: string;
      label: string;
      active: boolean;
    }>;
  };
  defaultSort?: SortingState;
}

const rowCountOptions = [10, 25, 50, 100];

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  defaultSort = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSort);

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
    const url = new URL(window.location.href);
    url.searchParams.set('per_page', value);
    router.get(url.toString(), {}, { preserveState: true, preserveScroll: true });
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
      
      <div className="flex items-center justify-start">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tampilkan</span>
          <Select
            value={pagination?.per_page.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={pagination?.per_page.toString()} />
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
      
      {pagination && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Total {pagination.total} pengguna
          </p>
          <div className="flex items-center space-x-2">
            {pagination.links.map((link, i) => {
              if (!link.url) return null;
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
    </div>
  );
}
