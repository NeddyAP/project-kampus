import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';

interface MenuItem {
    label: string;
    href: string;
}

export function createActionColumn<T>({
    editUrl,
    deleteUrl,
    viewUrl,
    additionalMenuItems,
}: {
    editUrl?: (row: T) => string;
    deleteUrl?: (row: T) => string;
    viewUrl?: (row: T) => string;
    additionalMenuItems?: (row: T) => (MenuItem | false)[];
}): ColumnDef<T> {
    const column: ColumnDef<T> = {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            const data = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {viewUrl && (
                            <DropdownMenuItem asChild>
                                <Link href={viewUrl(data)} className="cursor-pointer">
                                    Detail
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {editUrl && (
                            <DropdownMenuItem asChild>
                                <Link href={editUrl(data)} className="cursor-pointer">
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {deleteUrl && (
                            <DropdownMenuItem asChild>
                                <Link
                                    href={deleteUrl(data)}
                                    method="delete"
                                    as="button"
                                    className="cursor-pointer text-destructive"
                                >
                                    Hapus
                                </Link>
                            </DropdownMenuItem>
                        )}
                        {additionalMenuItems &&
                            additionalMenuItems(data)
                                .filter((item): item is MenuItem => Boolean(item))
                                .map((item) => (
                                    <DropdownMenuItem key={item.href} asChild>
                                        <Link href={item.href} className="cursor-pointer">
                                            {item.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };

    return column;
}