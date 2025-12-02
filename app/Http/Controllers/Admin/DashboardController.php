<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Batch;
use App\Models\TrainingCategory;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_trainers' => User::whereHas('role', fn($q) => $q->where('slug', 'trainer'))->count(),
            'total_participants' => User::whereHas('role', fn($q) => $q->where('slug', 'participant'))->count(),
            'total_batches' => Batch::count(),
            'active_batches' => Batch::whereIn('status', ['scheduled', 'ongoing'])->count(),
            'total_categories' => TrainingCategory::count(),
        ];

        $recentBatches = Batch::with(['category', 'trainer'])
            ->latest()
            ->take(5)
            ->get();

        $recentUsers = User::with('role')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentBatches' => $recentBatches,
            'recentUsers' => $recentUsers,
        ]);
    }

    public function reports()
    {
        // Implementasi laporan nanti
        return Inertia::render('Admin/Reports');
    }

    public function exportReport()
    {
        // Implementasi export nanti
    }
}
