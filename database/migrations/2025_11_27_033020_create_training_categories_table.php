<?php

// database/migrations/xxxx_xx_xx_create_training_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Tambah unique biar nama tidak duplikat
            $table->text('description')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('category_prerequisites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')
                  ->constrained('training_categories')
                  ->onDelete('cascade');
            $table->foreignId('prerequisite_id')
                  ->constrained('training_categories')
                  ->onDelete('cascade');

            // INI YANG WAJIB DITAMBAH!
            $table->unique(['category_id', 'prerequisite_id'], 'category_prereq_unique');

            // Index untuk performa
            $table->index('category_id');
            $table->index('prerequisite_id');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('category_prerequisites');
        Schema::dropIfExists('training_categories');
    }
};
