# Changelog

Catatan perubahan proyek.

## [Belum Dirilis]

## 2025-03-07

### Rencana

- Menambahkan form pengajuan magang dengan 2 kategori: Kuliah Kerja Lapangan (KKL) dan Kuliah Kerja Nyata (KKN).

## 2025-03-06

- Pembaruan `user-form.tsx`: Menambahkan prop `disabledFields` untuk menonaktifkan bidang peran.

## [0.0.1] - 2025-02-01

- Pengaturan awal proyek.

### Diubah

- Refaktor `UserController` ke `UserService`.
- Logika bisnis pengguna dipindahkan ke `UserService`.
- Peran pengguna tidak dapat diubah setelah pembuatan.
- Bidang peran read-only pada form edit.

### Dependensi

- @tanstack/react-table
- lucide-react

### Teknis

- Komponen `DataTable`, `SearchInput`, `AlertDialog`.
- Hook `useDebounce`.
- Penggunaan komponen formulir dari shadcn/ui, Zod, dan Lucide React.
- Penanganan rute hapus.

### Ditambahkan

- Komponen `UserForm` untuk pembuatan dan pengeditan pengguna.
- Dropdown pemilihan peran (Shadcn UI Select).
- Umpan balik validasi formulir.
- Tipe TypeScript untuk antarmuka `User`.
- Sistem manajemen pengguna dengan tabel data (TanStack React Table), pencarian debounced, paginasi, dan lokalisasi Bahasa Indonesia.
- Seeding database untuk pengguna (admin dan dummy).
- Form Pembuatan/Edit Pengguna dengan validasi Zod, hashing kata sandi, dan pesan dalam Bahasa Indonesia.
- Tombol Aksi pada Manajemen Pengguna.
- Fitur Hapus Pengguna dengan dialog konfirmasi dan pemeriksaan keamanan.
- Sistem peran pengguna (Superadmin, Admin, Dosen, Mahasiswa) dan middleware otorisasi.
- Sistem notifikasi toast (Sonner) dengan dukungan Bahasa Indonesia dan integrasi Inertia.js.
- Detail pengguna spesifik untuk profil berbasis peran.
