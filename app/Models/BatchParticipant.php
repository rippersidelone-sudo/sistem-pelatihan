<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BatchParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'batch_id',
        'user_id',
        'registration_status',
        'completion_status',
        'feedback',
        'notes',
    ];

    /**
     * Relasi ke Batch
     */
    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Relasi ke User (Participant)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Attendance (One to Many)
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Check if participant is approved
     */
    public function isApproved()
    {
        return $this->registration_status === 'approved';
    }

    /**
     * Check if participant has completed the training
     */
    public function hasCompleted()
    {
        return $this->completion_status === 'passed';
    }
}