# Changelog

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

## [2025-03-08] - Implementasi Admin Panel & Routing

### Added - Admin Panel
- Dashboard admin dengan:
  - Statistik pengguna (total, dosen, mahasiswa)
  - Statistik magang (total, menunggu, berjalan, selesai)
  - Aktivitas terbaru pengguna
  - Daftar magang terbaru
- Manajemen pengguna:
  - CRUD untuk admin, dosen, dan mahasiswa
  - Pengelolaan profil spesifik per role
  - Filter dan pencarian pengguna
  - Statistik pengguna

## [2025-03-08] - Penyempurnaan Routing & Media Manager

### Updated
- Standarisasi routing dengan prefix '/admin':
  - Memindahkan semua route admin ke dalam prefix '/admin'
  - Menyesuaikan URL di komponen navigasi dan breadcrumb
  - Meningkatkan konsistensi path URL di seluruh aplikasi

## [2025-03-08] - Implementasi Media Manager & Penyempurnaan Tampilan

### Added
- Media Manager untuk admin:
  - Grid view untuk semua berkas yang diunggah
  - Filter berdasarkan tipe file (Gambar/Dokumen)
  - Fitur pencarian berdasarkan nama file
  - Pratinjau untuk file gambar dan PDF
  - Informasi detail file (ukuran, tanggal upload, pengunggah)
  - Fitur download berkas

## [2025-03-08] - Penyempurnaan Tampilan Manajemen Magang

### Updated
- Penyempurnaan tampilan dashboard magang:
  - Menambahkan statistik total pengajuan magang
  - Menampilkan ringkasan status magang (Menunggu Persetujuan, Disetujui, Ditolak)
  - Optimalisasi tampilan aktivitas terbaru
  - Penambahan breadcrumb pada halaman detail magang
- Improvisasi UX dengan informasi status yang lebih jelas
- Penyesuaian tata letak untuk kemudahan navigasi

## [2025-03-06] - Sistem Magang & User Management

### Added - Sistem Magang
- Sistem manajemen magang dengan fitur:
  - Form pengajuan magang (KKL/KKN)
  - Manajemen persetujuan oleh admin
  - Assignment dosen pembimbing
  - Timeline aktivitas magang
  - Upload dokumen (surat pengantar, persetujuan, laporan)
  - Status tracking dan notifikasi

### Added - Database Structure
- Tabel `internships` untuk data magang
- Tabel `internship_logs` untuk aktivitas magang
- Tabel `internship_supervisions` untuk data bimbingan
- Tabel `activities` untuk activity logging system
- Integrasi dengan spatie/laravel-permission untuk manajemen roles
- Tabel profil terpisah untuk admin, dosen, dan mahasiswa

### Added - Components
- StatusBadge untuk menampilkan status magang
- FilterForm untuk filter dan pencarian
- InternshipsTable untuk daftar magang
- ActivityTimeline untuk riwayat aktivitas
- ApprovalForm untuk persetujuan/penolakan
- SupervisorAssignment untuk assignment dosen

### Added - User Management
- Role-based access control dengan spatie/laravel-permission
- Profil spesifik untuk setiap role:
  - Admin: Manajemen sistem
  - Dosen: Profil akademik dan supervisi
  - Mahasiswa: Data akademik dan magang
- Activity logging untuk user actions
- Dashboard dengan recent activities
- Proper type definitions dengan TypeScript
- Improved UI dengan shadcn-ui components

### Added - Data Seeding
- Default admin user (admin@gmail.com / a)
- 5 Dosen dengan profil akademik lengkap
- 20 Mahasiswa dengan data studi
- 50 Data magang dengan status bervariasi
- Log aktivitas dan data bimbingan
- 20 Sample activity logs

### Technical Improvements
- Type-safe components dengan TypeScript
- Proper role management dengan spatie/laravel-permission
- Activity logging system dengan polymorphic relations
- Improved service layer pattern
- Proper handling untuk soft deletes
- Comprehensive data factories dan seeders

### Fixed
- Memperbaiki error "array_key_first(): Argument #1 ($array) must be of type array, Closure given" pada ActivityFactory.
  Error ini disebabkan oleh penggunaan factory versi lama. Solusi: membersihkan cache dan database.
