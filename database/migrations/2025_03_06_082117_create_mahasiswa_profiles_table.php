<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mahasiswa_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nim')->unique()->comment('Nomor Induk Mahasiswa');
            $table->string('program_studi')->comment('Study program');
            $table->year('angkatan')->comment('Class year/batch');
            $table->enum('status_akademik', ['Aktif', 'Cuti', 'Lulus'])->default('Aktif')->comment('Academic status');
            $table->integer('semester')->default(1)->comment('Current semester');
            $table->foreignId('dosen_pembimbing_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('ipk', 3, 2)->nullable()->comment('GPA (Grade Point Average)');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswa_profiles');
    }
};
