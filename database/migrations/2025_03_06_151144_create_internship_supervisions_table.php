<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('internship_supervisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_id')->constrained()->onDelete('cascade');
            $table->foreignId('dosen_id')->constrained('users')->onDelete('cascade');
            
            $table->date('supervision_date');
            $table->enum('supervision_type', ['ONLINE', 'OFFLINE', 'HYBRID']);
            $table->string('supervision_location')->nullable();
            
            // Progress dan Penilaian
            $table->text('progress_notes');
            $table->text('improvements_needed')->nullable();
            $table->integer('progress_score')->nullable(); // Nilai 0-100
            
            // Penilaian Akhir (diisi saat magang selesai)
            $table->json('final_evaluation')->nullable(); // Menyimpan kriteria penilaian dalam format JSON
            $table->integer('final_score')->nullable(); // Nilai akhir 0-100
            
            $table->text('supervisor_notes')->nullable();
            $table->string('attachment_path')->nullable(); // Untuk file lampiran/dokumentasi
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internship_supervisions');
    }
};
