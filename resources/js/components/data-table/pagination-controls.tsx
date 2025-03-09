import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../ui/button';

interface PaginationControlsProps<TData> {
    table: Table<TData>;
}

export function PaginationControls<TData>({ table }: PaginationControlsProps<TData>) {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;

    // Generate array of page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        // Calculate start and end of visible pages
        let start = Math.max(currentPage - 1, 2);
        const end = Math.min(start + maxVisiblePages - 3, totalPages - 1);

        // Adjust start if we're near the end
        if (end === totalPages - 1) {
            start = Math.max(end - (maxVisiblePages - 3), 2);
        }

        // Add ellipsis if needed
        if (start > 2) {
            pages.push('...');
        }

        // Add visible pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed
        if (end < totalPages - 1) {
            pages.push('...');
        }

        // Always show last page
        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNum, idx) =>
                        typeof pageNum === 'number' ? (
                            <Button
                                key={idx}
                                variant={currentPage === pageNum ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => table.setPageIndex(pageNum - 1)}
                                className="min-w-[32px]"
                            >
                                {pageNum}
                            </Button>
                        ) : (
                            <span key={idx} className="px-2">
                                {pageNum}
                            </span>
                        ),
                    )}
                </div>

                <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
