<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Participant
            $table->integer('rating')->default(0); // 1-5
            $table->text('comment')->nullable();
            $table->text('trainer_response')->nullable(); // Response dari trainer
            $table->timestamps();

            $table->unique(['batch_id', 'user_id']); // Satu peserta hanya bisa feedback sekali per batch
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
