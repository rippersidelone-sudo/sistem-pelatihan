<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\TrainingCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchController extends Controller
{
    public function index(Request $request)
{
    $query = Batch::with(['category', 'trainer', 'creator'])
        ->withCount('participants');

    if ($request->has('search') && $request->search) {
        $query->where('title', 'like', "%{$request->search}%");
    }

    if ($request->has('status') && $request->status) {
        $query->where('status', $request->status);
    }

    if ($request->has('category') && $request->category) {
        $query->where('category_id', $request->category);
    }

    if ($request->has('trainer') && $request->trainer) {
        $query->where('trainer_id', $request->trainer);
    }

    // Export CSV
    if ($request->has('export') && $request->export === 'csv') {
        $batches = $query->get();
        
        $filename = 'batches_' . date('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($batches) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Kode', 'Judul Batch', 'Trainer', 'Tanggal', 'Peserta', 'Status']);

            foreach ($batches as $batch) {
                fputcsv($file, [
                    'TRN-2025-' . str_pad($batch->id, 3, '0', STR_PAD_LEFT),
                    $batch->title,
                    $batch->trainer->full_name ?? 'N/A',
                    $batch->start_date,
                    ($batch->participants_count ?? 0) . '/' . ($batch->max_participants ?? 0),
                    strtoupper($batch->status),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    $batches = $query->latest()->paginate(20);
    
    $categories = TrainingCategory::all();
    $trainers = User::whereHas('role', fn($q) => $q->where('slug', 'trainer'))->get();

    return Inertia::render('Admin/Batches/Index', [
        'batches' => $batches,
        'categories' => $categories,
        'trainers' => $trainers,
        'filters' => $request->only(['search', 'status', 'category', 'trainer']),
    ]);
    }
}