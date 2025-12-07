<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TrainingCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'created_by'];

    /**
     * Relasi ke User (Creator)
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relasi ke Batch
     */
    public function batches(): HasMany
    {
        return $this->hasMany(Batch::class, 'category_id');
    }

    /**
     * Kategori yang HARUS diselesaikan sebelum mengambil kategori ini
     */
    public function prerequisites(): BelongsToMany
    {
        return $this->belongsToMany(
            TrainingCategory::class,
            'category_prerequisites',
            'category_id',
            'prerequisite_id'
        )->withTimestamps();
    }

    /**
     * Kategori yang MENJADIKAN kategori ini sebagai syarat (prerequisite)
     */
    public function prerequisiteFor(): BelongsToMany
    {
        return $this->belongsToMany(
            TrainingCategory::class,
            'category_prerequisites',
            'prerequisite_id',
            'category_id'
        )->withTimestamps();
    }

    /**
     * Check if category has prerequisites
     */
    public function hasPrerequisites(): bool
    {
        return $this->prerequisites()->exists();
    }

    /**
     * Check if category is prerequisite for other categories
     */
    public function isPrerequisiteFor(): bool
    {
        return $this->prerequisiteFor()->exists();
    }
}