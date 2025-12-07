<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'batch_participant_id',
        'check_in_time',
        'status', // checked_in, validated, absent
        'notes',
        'validated_by',
        'validated_at',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
        'validated_at' => 'datetime',
    ];

    /**
     * Relasi ke BatchParticipant
     */
    public function batchParticipant()
    {
        return $this->belongsTo(BatchParticipant::class);
    }

    /**
     * Relasi ke User yang memvalidasi (Trainer)
     */
    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    /**
     * Scope untuk filter by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope untuk filter by batch
     */
    public function scopeByBatch($query, $batchId)
    {
        return $query->whereHas('batchParticipant', function($q) use ($batchId) {
            $q->where('batch_id', $batchId);
        });
    }

    /**
     * Check if attendance is validated
     */
    public function isValidated()
    {
        return $this->status === 'validated';
    }

    /**
     * Check if participant has checked in
     */
    public function hasCheckedIn()
    {
        return $this->status === 'checked_in' || $this->status === 'validated';
    }
}