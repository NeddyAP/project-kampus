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
        Schema::create('dosen_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nip')->unique()->comment('Nomor Induk Pegawai');
            $table->string('bidang_keahlian')->comment('Field of expertise');
            $table->string('pendidikan_terakhir')->comment('Latest education');
            $table->string('jabatan_akademik')->comment('Academic position');
            $table->enum('status_kepegawaian', ['PNS', 'Non-PNS'])->default('Non-PNS')->comment('Employment status');
            $table->year('tahun_mulai_mengajar')->comment('Year started teaching');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dosen_profiles');
    }
};
