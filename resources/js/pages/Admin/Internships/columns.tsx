import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { Link } from "@inertiajs/react"
import { ArrowUpDown, Eye } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Internship } from "@/types/internship"
import { Badge } from "@/components/ui/badge"

const getStatusBadgeColor = (status: string) => {
    switch (status) {
        case "MENUNGGU_PERSETUJUAN":
            return "bg-yellow-500"
        case "DISETUJUI":
            return "bg-green-500"
        case "DITOLAK":
            return "bg-red-500"
        case "SEDANG_BERJALAN":
            return "bg-blue-500"
        case "SELESAI":
            return "bg-gray-500"
        default:
            return "bg-gray-500"
    }
}

const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ")
}

export const columns: ColumnDef<Internship>[] = [
    {
        id: "mahasiswa_name",
        accessorFn: (row) => row.mahasiswa?.name,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Nama Mahasiswa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        id: "mahasiswa_nim",
        accessorFn: (row) => row.mahasiswa?.nim,
        header: "NIM",
    },
    {
        accessorKey: "type",
        header: "Tipe",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge className={getStatusBadgeColor(status)}>
                    {getStatusLabel(status)}
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
                    Tanggal Pengajuan
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
            const internship = row.original

            return (
                <Link
                    href={`/admin/internships/${internship.id}`}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
                >
                    <Eye className="h-4 w-4" />
                </Link>
            )
        },
    },
]
