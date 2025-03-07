# Changelog

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
