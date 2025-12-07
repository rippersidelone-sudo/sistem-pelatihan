<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\TrainingCategory;

class Batch extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category_id',
        'trainer_id',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'max_participants',
        'min_participants',
        'zoom_link',
        'status',
        'description',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Relasi ke TrainingCategory (Kategori Pelatihan)
     */
    public function category()
    {
        return $this->belongsTo(TrainingCategory::class, 'category_id');
    }

    /**
     * Relasi ke Trainer (User)
     */
    public function trainer()
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    /**
     * Relasi ke BatchParticipant (One to Many)
     */
    public function participants()
    {
        return $this->hasMany(BatchParticipant::class);
    }

    /**
     * Get approved participants only
     */
    public function approvedParticipants()
    {
        return $this->participants()->where('registration_status', 'approved');
    }

    /**
     * Count participants
     */
    public function getParticipantsCountAttribute()
    {
        return $this->participants()->count();
    }

    /**
     * Check if batch is full
     */
    public function isFull()
    {
        return $this->participants()->count() >= $this->max_participants;
    }
}