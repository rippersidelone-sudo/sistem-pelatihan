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

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function batches(): HasMany
    {
        return $this->hasMany(Batch::class, 'category_id');
    }

    // Prerequisites (kategori yang harus diselesaikan sebelum mengambil kategori ini)
    public function prerequisites(): BelongsToMany
    {
        return $this->belongsToMany(
            TrainingCategory::class,
            'category_prerequisites',
            'category_id',
            'prerequisite_id'
        )->withTimestamps();
    }

    // Kategori yang memiliki kategori ini sebagai prerequisite
    public function dependentCategories(): BelongsToMany
    {
        return $this->belongsToMany(
            TrainingCategory::class,
            'category_prerequisites',
            'prerequisite_id',
            'category_id'
        )->withTimestamps();
    }
}
