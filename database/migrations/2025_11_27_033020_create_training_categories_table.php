<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Python Game Developer
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Tabel pivot untuk prerequisites (self-referencing many-to-many)
        Schema::create('category_prerequisites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('training_categories')->onDelete('cascade');
            $table->foreignId('prerequisite_id')->constrained('training_categories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_prerequisites');
        Schema::dropIfExists('training_categories');
    }
};
