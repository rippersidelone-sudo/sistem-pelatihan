<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\BatchParticipant;
use App\Models\TrainingCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportsController extends Controller
{
    public function index(Request $request)
    {
        // Basic Stats
        $stats = [
            'total_batches' => Batch::count(),
            'scheduled_batches' => Batch::where('status', 'scheduled')->count(),
            'ongoing_batches' => Batch::where('status', 'ongoing')->count(),
            'completed_batches' => Batch::where('status', 'completed')->count(),
            
            'total_participants' => BatchParticipant::count(),
            'registered_participants' => 0,
            'approved_participants' => BatchParticipant::where('registration_status', 'approved')->count(),
            'ongoing_participants' => BatchParticipant::whereHas('batch', function($q) {
                $q->where('status', 'ongoing');
            })->count(),
            'completed_participants' => BatchParticipant::where('completion_status', 'passed')->count(),
            'failed_participants' => 0,
            'passed_participants' => BatchParticipant::where('completion_status', 'passed')->count(),
            'pending_registrations' => BatchParticipant::where('registration_status', 'pending')->count(),
            
            'certificates' => BatchParticipant::where('completion_status', 'passed')->count(),
            'avg_attendance' => 33, // Calculate from attendance table
            'avg_participants_per_batch' => round(BatchParticipant::count() / max(Batch::count(), 1)),
            
            // Branch data for chart
            'branch_data' => [
                ['name' => 'JKT-PST', 'total' => 2, 'passed' => 0],
                ['name' => 'BDG', 'total' => 1, 'passed' => 1],
                ['name' => 'SBY', 'total' => 0, 'passed' => 0],
            ],
        ];

        // Batches untuk tab Batch
        $batches = Batch::with(['category', 'trainer'])
            ->withCount('participants')
            ->latest()
            ->get()
            ->map(function($batch) {
                return [
                    'id' => $batch->id,
                    'title' => $batch->title,
                    'code' => 'TRN-' . date('Y', strtotime($batch->created_at)) . '-' . str_pad($batch->id, 3, '0', STR_PAD_LEFT),
                    'category' => $batch->category->name ?? '-',
                    'status' => $batch->status,
                    'date_range' => date('d/m/Y', strtotime($batch->start_date)) . ' - ' . date('d/m/Y', strtotime($batch->end_date)),
                    'participants_count' => $batch->participants_count ?? 0,
                ];
            });

        // Participants untuk tab Peserta
        $participants = BatchParticipant::with(['user', 'batch'])
            ->latest()
            ->get()
            ->map(function($participant) {
                return [
                    'id' => $participant->id,
                    'name' => $participant->user->full_name ?? $participant->user->name,
                    'email' => $participant->user->email,
                    'batch' => $participant->batch->title ?? '-',
                    'status' => $participant->registration_status,
                    'completion_status' => $participant->completion_status,
                ];
            });

        // Categories untuk tab Performa
        $categories = TrainingCategory::withCount(['batches'])
            ->get()
            ->map(function($category) {
                $totalParticipants = BatchParticipant::whereHas('batch', function($q) use ($category) {
                    $q->where('category_id', $category->id);
                })->count();

                $passedParticipants = BatchParticipant::whereHas('batch', function($q) use ($category) {
                    $q->where('category_id', $category->id);
                })->where('completion_status', 'passed')->count();

                $completionRate = $totalParticipants > 0 
                    ? round(($passedParticipants / $totalParticipants) * 100) 
                    : 0;

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'batch_count' => $category->batches_count ?? 0,
                    'participant_count' => $totalParticipants,
                    'passed_count' => $passedParticipants,
                    'completion_rate' => $completionRate,
                ];
            });

        return Inertia::render('Coordinator/Reports/Index', [
            'stats' => $stats,
            'batches' => $batches,
            'participants' => $participants,
            'categories' => $categories,
        ]);
    }
}