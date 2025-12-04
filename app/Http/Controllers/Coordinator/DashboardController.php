<?php

// app/Http/Controllers/Coordinator/DashboardController.php
namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\BatchParticipant;
use App\Models\TrainingCategory;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_batches' => Batch::count(),
            'scheduled_batches' => Batch::where('status', 'scheduled')->count(),
            'ongoing_batches' => Batch::where('status', 'ongoing')->count(),
            'completed_batches' => Batch::where('status', 'completed')->count(),
            'total_categories' => TrainingCategory::count(),
            'pending_registrations' => BatchParticipant::where('registration_status', 'pending')->count(),
            'total_participants' => BatchParticipant::where('registration_status', 'approved')->distinct('user_id')->count(),
        ];

        $upcomingBatches = Batch::with(['category', 'trainer'])
            ->withCount('participants')
            ->where('status', 'scheduled')
            ->where('start_date', '>=', now())
            ->orderBy('start_date')
            ->take(5)
            ->get();

        $pendingRegistrations = BatchParticipant::with(['batch.category', 'user'])
            ->where('registration_status', 'pending')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Coordinator/Dashboard', [
            'stats' => $stats,
            'upcomingBatches' => $upcomingBatches,
            'pendingRegistrations' => $pendingRegistrations,
        ]);
    }
}