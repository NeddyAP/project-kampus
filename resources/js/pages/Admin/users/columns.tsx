import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link, router } from "@inertiajs/react"
import { toast } from "sonner"

interface User {
    id: number
    name: string
    email: string
    role: string
    profile_data?: Record<string, unknown>
    created_at: string
    updated_at: string
    deleted_at?: string
}

const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
        case "admin":
            return "bg-red-500"
        case "dosen":
            return "bg-blue-500"
        case "mahasiswa":
            return "bg-green-500"
        default:
            return "bg-gray-500"
    }
}

const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
        admin: "Administrator",
        dosen: "Dosen",
        mahasiswa: "Mahasiswa",
    }
    return labels[role.toLowerCase()] || role
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role") as string
            return (
                <Badge className={getRoleBadgeColor(role)}>
                    {getRoleLabel(role)}
                </Badge>
            )
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tanggal Registrasi
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"))
            return format(date, "d MMMM yyyy", { locale: id })
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original

            const handleDelete = () => {
                router.delete(`/admin/users/${user.id}`, {
                    onSuccess: () => {
                        toast.success("Pengguna berhasil dihapus")
                    },
                    onError: () => {
                        toast.error("Gagal menghapus pengguna")
                    },
                })
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/admin/users/${user.id}/edit`}
                                className="flex items-center"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={handleDelete}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
