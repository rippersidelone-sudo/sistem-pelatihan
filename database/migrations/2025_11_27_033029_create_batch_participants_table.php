<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('batch_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Participant
            $table->enum('registration_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->enum('completion_status', ['not_started', 'in_progress', 'passed', 'failed'])->default('not_started');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['batch_id', 'user_id']); // Satu peserta hanya bisa daftar sekali per batch
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('batch_participants');
    }
};

