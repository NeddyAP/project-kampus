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
        Schema::table('internship_supervisions', function (Blueprint $table) {
            $table->foreignId('internship_id')->nullable()->change();
            $table->string('title')->after('dosen_id');
            $table->text('notes')->after('title');
            $table->dropColumn([
                'supervision_date',
                'supervision_type',
                'supervision_location',
                'progress_notes',
                'improvements_needed',
                'progress_score',
                'final_evaluation',
                'final_score',
                'supervisor_notes'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('internship_supervisions', function (Blueprint $table) {
            $table->foreignId('internship_id')->nullable(false)->change();
            $table->dropColumn(['title', 'notes']);
            $table->date('supervision_date')->nullable();
            $table->string('supervision_type')->nullable();
            $table->string('supervision_location')->nullable();
            $table->text('progress_notes')->nullable();
            $table->string('improvements_needed')->nullable();
            $table->integer('progress_score')->nullable();
            $table->json('final_evaluation')->nullable();
            $table->integer('final_score')->nullable();
            $table->text('supervisor_notes')->nullable();
        });
    }
};