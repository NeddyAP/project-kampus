# Rencana Refaktorisasi Halaman Magang dan Pengguna
​
## Tujuan
- Menyatukan tampilan DataTable di halaman Magang dan Pengguna agar konsisten.
- Menggunakan komponen `DataTable` dari `@/components/data-table/data-table` secara konsisten pada kedua halaman.
- Membuat file definisi kolom khusus untuk magang di `resources/js/pages/admin/internships/columns.tsx`.
​
## Rencana Tindakan
1. **Refaktorisasi Halaman Magang (`resources/js/pages/admin/internships/index.tsx`):**
   - Hapus penggunaan komponen `InternshipsTable`.
   - Impor dan gunakan komponen `DataTable` dari `@/components/data-table/data-table`.
   - Buat file `resources/js/pages/admin/internships/columns.tsx` yang mendefinisikan kolom seperti Nama Mahasiswa, Kategori, Status, dan Tanggal Pengajuan.
   - Sesuaikan properti `data`, `pagination`, dan `filters` agar sesuai dengan data yang diterima dari controller.
​
2. **Refaktorisasi Halaman Pengguna (`resources/js/pages/admin/users/index.tsx`):**
   - Verifikasi bahwa penggunaan `DataTable` sudah konsisten.
   - Pastikan styling dan penyajian kolom seragam dengan halaman magang.
​
3. **Controller:**
   - Tidak ada perubahan pada controller, data yang dihasilkan sudah sesuai dengan kebutuhan komponen DataTable.
​
## Diagram Alir
```mermaid
flowchart TD
    A[Refactor Halaman Magang (internships/index.tsx)]
    B[Hapus penggunaan <InternshipsTable>]
    C[Ganti dengan <DataTable>]
    D[Buat definisi kolom khusus di columns.tsx]
    E[Sesuaikan props data, pagination, dan filters]
    F[Refactor Halaman Pengguna (users/index.tsx)]
    G[Verifikasi konsistensi DataTable]
    H[Pastikan styling seragam]
    I[Pastikan data dari controller sesuai]

    A --> B
    B --> C
    C --> D
    D --> E
    A --> E
    F --> G
    G --> H
    E --> I
    H --> I
```
​
## Catatan
- Refaktorisasi ini bertujuan untuk meningkatkan konsistensi dan kemudahan perawatan kode.
- Pastikan seluruh teks dalam bahasa Indonesia dan sesuai dengan panduan styling komponen yang ada.