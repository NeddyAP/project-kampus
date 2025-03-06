import {
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import { Link } from "@inertiajs/react";

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
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
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
