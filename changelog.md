# Changelog

## [Unreleased]

### Fixed

- Corrected return type declaration in InternshipSupervisionService::getUpcomingSupervisions method from Collection to LengthAwarePaginator to match actual implementation (2025-02-01)
- Fixed "Uncaught TypeError: upcomingSupervisions.map is not a function" by updating TypeScript interfaces and component to handle paginated data correctly (2025-02-01)

## [2025-03-27] - Peningkatan Sistem Bimbingan dan Refaktorisasi Kode

### Changed

- Peningkatan sistem bimbingan:
    - Penambahan mahasiswa dengan status "Disetujui" untuk bimbingan
    - Implementasi fitur pencarian dan filter untuk daftar mahasiswa
    - Implementasi pagination untuk daftar mahasiswa dan jadwal bimbingan
    - Penambahan filter tanggal untuk jadwal bimbingan

### Technical

- Refaktorisasi kode untuk maintainability yang lebih baik:
    - Pemisahan business logic ke dalam service layer
    - Implementasi form request untuk validasi
    - Optimalisasi query database
    - Peningkatan type safety dengan TypeScript
    - Implementasi proper dependency injection

## [2025-03-26] - Peningkatan Sistem Kehadiran Bimbingan

### Changed

- Peningkatan sistem kehadiran bimbingan:
    - Pemisahan halaman kehadiran untuk antarmuka yang lebih baik
    - Penambahan opsi status kehadiran (Hadir, Izin, Sakit, Tidak Hadir)
    - Optimalisasi tampilan daftar mahasiswa dan form kehadiran
    - Penyederhanaan proses pencatatan kehadiran
    - Peningkatan UX dengan navigasi yang lebih intuitif

## [2025-03-25] - Penyempurnaan Sistem Bimbingan dan Kehadiran

### Changed

- Penyempurnaan sistem bimbingan dan kehadiran:
    - Perubahan struktur data bimbingan untuk mendukung bimbingan kolektif
    - Optimalisasi pencatatan kehadiran untuk semua mahasiswa dalam satu sesi
    - Penyederhanaan alur kerja dosen dalam mencatat kehadiran
    - Integrasi yang lebih baik antara jadwal bimbingan dan kehadiran
    - Peningkatan efisiensi dengan menghilangkan duplikasi data

## [2025-03-24] - Penambahan Fitur Kehadiran Magang

### Added

- Implementasi fitur kehadiran untuk dosen pembimbing:
    - Tab baru untuk manajemen kehadiran mahasiswa
    - Form pencatatan kehadiran dengan tanggal, status, dan catatan
    - Riwayat kehadiran mahasiswa dengan badge status
    - Integrasi dengan sistem logging untuk tracking kehadiran
    - Validasi input untuk memastikan data valid
    - Penggunaan Sentry untuk monitoring aktivitas

## [2025-03-23] - Implementasi Sistem Magang untuk Mahasiswa dan Dosen

### Added

- Implementasi sistem magang untuk mahasiswa:

    - Halaman daftar magang dengan tampilan card dan indikator progres
    - Halaman detail magang dengan informasi lengkap dan status
    - Fitur pengajuan magang baru dengan form lengkap
    - Fitur pencatatan log aktivitas magang
    - Visualisasi progres magang dengan progress bar
    - Tampilan status magang dengan badge berwarna
    - Integrasi dengan sistem file untuk upload dokumen

- Implementasi sistem magang untuk dosen:

    - Halaman daftar bimbingan magang dengan tampilan card
    - Halaman detail bimbingan dengan informasi lengkap
    - Fitur pemberian catatan bimbingan kepada mahasiswa
    - Fitur melihat log aktivitas mahasiswa
    - Visualisasi progres bimbingan dengan progress bar

- Implementasi backend:
    - Controller untuk manajemen magang mahasiswa (MahasiswaInternshipController)
    - Controller untuk manajemen bimbingan dosen (DosenInternshipController)
    - Rute terpisah untuk mahasiswa dan dosen
    - Validasi data dan keamanan akses

## [2025-03-22] - Perbaikan Error User::ROLES

### Fixed

- Memperbaiki error "Undefined constant App\Models\User::ROLES":
    - Menghapus kolom enum 'role' dari tabel users karena sudah menggunakan Spatie Permission
    - Mengubah referensi User::ROLES menjadi User::getRoleNames() di StoreUserRequest
    - Memastikan konsistensi penggunaan role di seluruh aplikasi
    - Menyelaraskan migrasi database dengan implementasi permission

## [2025-03-21] - Perbaikan Format Role di User Management

### Fixed

- Memperbaiki format role yang sebelumnya berupa angka menjadi string:
    - Mengubah UserController untuk mengirimkan data role lengkap (key-value pairs)
    - Menyesuaikan komponen user-form.tsx untuk menangani format role baru
    - Memperbaiki filter role di halaman index pengguna
    - Memastikan konsistensi antara backend dan frontend dalam penanganan role
    - Meningkatkan keterbacaan dengan menampilkan nama role yang lebih deskriptif

## [2025-03-20] - Perbaikan Form Profil Pengguna

### Fixed

- Memperbaiki masalah form profil yang tidak muncul di tab Informasi Profil:
    - Menghapus fungsi renderProfileForm dan menggunakan conditional rendering langsung
    - Menambahkan default role untuk mode create
    - Menambahkan pesan informasi ketika role belum dipilih
    - Memastikan form profil yang sesuai ditampilkan berdasarkan role yang dipilih
    - Memperbaiki alur navigasi antar tab

## [2025-03-19] - Perbaikan Navigasi Form Pengguna

### Updated

- Perbaikan navigasi form pengguna untuk pengalaman yang lebih baik:
    - Menghapus perpindahan tab otomatis saat memilih role
    - Menambahkan tombol "Lanjutkan" di tab Informasi Dasar untuk navigasi manual
    - Menambahkan tombol "Kembali" di tab Informasi Profil
    - Menonaktifkan tab Informasi Profil sampai role dipilih
    - Memindahkan tombol "Simpan" ke tab Informasi Profil saja
    - Validasi input dasar sebelum dapat melanjutkan ke tab profil

## [2025-03-18] - Peningkatan User Form & Pemilihan Role

### Added

- Peningkatan form pengguna untuk menampilkan profil berdasarkan role:
    - Penambahan navigasi otomatis ke tab profil saat role dipilih
    - Penambahan pesan informasi ketika role belum dipilih
    - Penambahan pesan panduan untuk mengisi profil sesuai role
    - Perbaikan tipe data User untuk mendukung properti role dan profil
    - Optimalisasi UX dengan feedback visual yang lebih baik

## [2025-03-17] - Perbaikan Admin Profile Form

### Fixed

- Memperbaiki form profil admin yang tidak menyimpan data dengan benar:
    - Mengupdate UserService untuk menyimpan data profil admin saat pembuatan user baru
    - Mengupdate UserService untuk memperbarui data profil admin saat update user
    - Memastikan semua field profil admin (ID Pegawai, Departemen, Jabatan, dll) tersimpan dengan benar
    - Memperbaiki konsistensi antara frontend form dan backend service

## [2025-03-16] - Perbaikan Error Filter Role

### Fixed

- Memperbaiki error "Uncaught TypeError: roles.map is not a function":
    - Mengubah format data roles dari associative array menjadi indexed array
    - Menggunakan array_keys() untuk mendapatkan daftar role yang valid
    - Memastikan konsistensi format data roles di semua controller methods
    - Perbaikan pada UserController untuk method index, create, dan edit

## [2025-03-15] - Peningkatan Navigasi Pagination & Filter Role

### Added

- Peningkatan navigasi pagination:
    - Penambahan tombol "First Page" untuk langsung ke halaman pertama
    - Penambahan tombol "Previous Page" untuk ke halaman sebelumnya
    - Penambahan tombol "Next Page" untuk ke halaman berikutnya
    - Penambahan tombol "Last Page" untuk langsung ke halaman terakhir
    - Optimalisasi UX dengan ikon yang intuitif
- Penambahan filter berdasarkan role di halaman Manajemen Pengguna:
    - Filter untuk melihat pengguna berdasarkan role (admin, dosen, mahasiswa)
    - Integrasi dengan server-side filtering
    - Preservasi filter saat navigasi antar halaman
    - UI yang konsisten dengan filter lainnya

## [2025-03-14] - Perbaikan Pagination & Preservasi Filter

### Fixed

- Perbaikan pagination yang menyebabkan refresh dan kembali ke halaman pertama:
    - Implementasi handlePageNavigation untuk mempertahankan semua filter saat berpindah halaman
    - Perbaikan handlePerPageChange untuk mempertahankan filter saat mengubah jumlah data per halaman
    - Memastikan parameter URL dipertahankan saat navigasi
    - Optimalisasi UI untuk tampilan yang lebih responsif
- Penyempurnaan layout:
    - Perbaikan tata letak untuk tampilan mobile
    - Penambahan flex-wrap untuk mencegah overflow pada layar kecil
    - Pengelompokan kontrol pagination dan per-page selector

## [2025-03-13] - Penghapusan Duplikasi DataTable & Perbaikan Search

### Fixed

- Menghapus duplikasi DataTable component:
    - Menghapus file `resources/js/components/ui/data-table.tsx` yang duplikat
    - Memastikan semua komponen menggunakan DataTable dari `resources/js/components/data-table/data-table.tsx`
- Perbaikan search functionality di DataTable:
    - Implementasi debouncing untuk mengurangi request ke server
    - Penambahan UI yang lebih baik dengan ikon search dan clear
    - Perbaikan state management untuk search query
    - Memastikan konsistensi antara client-side dan server-side search

## [2025-03-12] - Perbaikan Duplikasi Search & Optimalisasi Komponen

### Fixed

- Mengatasi duplikasi search functionality:
    - Menghapus custom search di FilterForm dan menggunakan search bawaan DataTable
    - Menghapus komponen FilterForm yang menyebabkan unlimited refresh
    - Memindahkan filter status dan tipe langsung ke halaman index
- Optimalisasi performa:
    - Mengurangi jumlah re-render yang tidak perlu
    - Menghilangkan efek samping yang menyebabkan refresh berulang
    - Menyederhanakan alur data untuk pencarian dan filter

## [2025-03-11] - Perbaikan Duplikasi DataTable & Konsistensi Komponen

### Fixed

- Mengatasi duplikasi DataTable component:
    - Standardisasi penggunaan DataTable dari direktori components/data-table
    - Menghapus referensi ganda ke DataTable dari direktori components/ui
    - Memastikan konsistensi implementasi di seluruh aplikasi
- Penyempurnaan integrasi server-side pagination:
    - Perbaikan handling search parameter di InternshipsTable
    - Optimalisasi FilterForm untuk mendukung pencarian
    - Konsistensi implementasi pencarian di UserIndex dan InternshipsIndex
    - Memastikan semua komponen menggunakan pattern yang sama

## [2025-03-10] - Implementasi Server-side Pagination & Penyeragaman UI

### Updated

- Implementasi server-side pagination pada halaman Manajemen Magang:
    - Migrasi dari client-side filtering ke server-side filtering
    - Optimalisasi performa dengan pagination dari database
    - Penambahan filter pencarian berdasarkan nama mahasiswa
    - Penyempurnaan filter berdasarkan status dan tipe magang
    - Integrasi dengan DataTable component
- Penyeragaman UI pada halaman Manajemen Pengguna:
    - Menyesuaikan tampilan dengan halaman Manajemen Magang
    - Implementasi filter pencarian yang lebih responsif
    - Perbaikan tampilan aktivitas terakhir
    - Optimalisasi tata letak untuk konsistensi UX
- Refactoring controller untuk konsistensi:
    - Standarisasi format response di InternshipController
    - Standarisasi format response di UserController
    - Optimalisasi query database

## [2025-03-08] - Penyempurnaan Data Table & Admin Panel

### Updated

- Peningkatan TanStack React Table:

    - Dukungan untuk server-side dan client-side pagination
    - Fitur pagination yang lebih lengkap:
        - Kontrol ukuran halaman (10, 25, 50, 100)
        - Navigasi halaman dengan angka
        - Status dan informasi halaman
    - Fitur pencarian terintegrasi dengan server-side
    - Sorting dengan indikator visual yang jelas
    - Type-safe dengan TypeScript
    - Konsistensi UX di semua tabel
    - Optimalisasi performa rendering
    - Dukungan untuk menu item dinamis
    - Proper error handling

- Penyempurnaan implementasi:
    - User management table
    - Internships table
    - Media manager grid
