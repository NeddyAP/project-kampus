<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('dosen_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();

            $table->enum('category', ['KKL', 'KKN']);
            $table->string('company_name');
            $table->text('company_address');
            $table->string('company_phone');
            $table->string('supervisor_name');
            $table->string('supervisor_phone');

            $table->date('start_date');
            $table->date('end_date');

            $table->string('cover_letter_path')->nullable(); // Surat Pengantar
            $table->string('approval_letter_path')->nullable(); // Surat Persetujuan
            $table->string('report_file_path')->nullable(); // Laporan Akhir

            $table->enum('status', [
                'DRAFT',
                'MENUNGGU_PERSETUJUAN',
                'DISETUJUI',
                'DITOLAK',
                'SEDANG_BERJALAN',
                'SELESAI',
            ])->default('DRAFT');

            $table->text('rejection_reason')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internships');
    }
};
