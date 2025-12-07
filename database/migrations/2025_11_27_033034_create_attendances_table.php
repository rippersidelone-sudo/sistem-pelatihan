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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('batch_participant_id')->constrained('batch_participants')->onDelete('cascade');
            $table->timestamp('check_in_time')->nullable();
            $table->enum('status', ['absent', 'checked_in', 'validated'])->default('absent');
            $table->text('notes')->nullable();
            $table->foreignId('validated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();

            // Index untuk performa
            $table->index('batch_participant_id');
            $table->index('status');
            $table->index('check_in_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};