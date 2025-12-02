<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'full_name',
        'phone',
        'role_id',
        'branch',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function trainedBatches(): HasMany
    {
        return $this->hasMany(Batch::class, 'trainer_id');
    }

    public function participatedBatches(): BelongsToMany
    {
        return $this->belongsToMany(Batch::class, 'batch_participants')
            ->withPivot('registration_status', 'completion_status', 'notes')
            ->withTimestamps();
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }

    // Helper methods
    public function isMasterHQ(): bool
    {
        return $this->role->slug === 'master-hq';
    }

    public function isCoordinator(): bool
    {
        return $this->role->slug === 'training-coordinator';
    }

    public function isTrainer(): bool
    {
        return $this->role->slug === 'trainer';
    }

    public function isBranchCoordinator(): bool
    {
        return $this->role->slug === 'branch-coordinator';
    }

    public function isParticipant(): bool
    {
        return $this->role->slug === 'participant';
    }
}
