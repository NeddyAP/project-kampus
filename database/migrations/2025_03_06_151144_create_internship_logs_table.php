<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('internship_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('internship_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->enum('type', [
                'STATUS_CHANGE',
                'COMMENT',
                'DOCUMENT_UPLOAD',
                'ACTIVITY_REPORT',
                'SUPERVISION'
            ]);
            
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('metadata')->nullable(); // Untuk menyimpan data tambahan seperti status sebelum/sesudah
            
            $table->string('attachment_path')->nullable(); // Untuk file lampiran jika ada
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internship_logs');
    }
};
