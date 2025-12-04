<?php

namespace App\Http\Controllers\Coordinator;

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
        $query = Batch::with(['category', 'trainer'])
            ->withCount('participants');

        // Apply filters
        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $batches = $query->latest()->get();
        
        // Calculate stats
        $stats = [
            'total_batches' => Batch::count(),
            'scheduled_batches' => Batch::where('status', 'scheduled')->count(),
            'ongoing_batches' => Batch::where('status', 'ongoing')->count(),
            'completed_batches' => Batch::where('status', 'completed')->count(),
        ];
        
        $categories = TrainingCategory::all();

        return Inertia::render('Coordinator/Batches/Index', [
            'batches' => $batches,
            'categories' => $categories,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        $categories = TrainingCategory::all();
        $trainers = User::whereHas('role', fn($q) => $q->where('slug', 'trainer'))
            ->where('status', 'active')
            ->get();

        return Inertia::render('Coordinator/Batches/Create', [
            'categories' => $categories,
            'trainers' => $trainers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:training_categories,id',
            'trainer_id' => 'required|exists:users,id',
            'start_date' => 'required|date|after:now',
            'end_date' => 'required|date|after:start_date',
            'min_participants' => 'nullable|integer|min:0',
            'max_participants' => 'required|integer|min:1|max:100',
            'zoom_link' => 'nullable|url',
            'assignment_description' => 'nullable|string',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['status'] = 'scheduled';

        Batch::create($validated);

        return redirect()->route('coordinator.batches.index')
            ->with('success', 'Batch created successfully.');
    }

    public function show(Batch $batch)
    {
        $batch->load([
            'category',
            'trainer',
            'participants.user',
            'attendances.user',
            'submissions.user',
            'materials',
            'feedbacks.user'
        ]);

        return Inertia::render('Coordinator/Batches/Show', [
            'batch' => $batch,
        ]);
    }

    public function edit(Batch $batch)
    {
        $categories = TrainingCategory::all();
        $trainers = User::whereHas('role', fn($q) => $q->where('slug', 'trainer'))
            ->where('status', 'active')
            ->get();

        return Inertia::render('Coordinator/Batches/Edit', [
            'batch' => $batch->load('category', 'trainer'),
            'categories' => $categories,
            'trainers' => $trainers,
        ]);
    }

    public function update(Request $request, Batch $batch)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:training_categories,id',
            'trainer_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'min_participants' => 'nullable|integer|min:0',
            'max_participants' => 'required|integer|min:1|max:100',
            'zoom_link' => 'nullable|url',
            'assignment_description' => 'nullable|string',
        ]);

        $batch->update($validated);

        return redirect()->route('coordinator.batches.index')
            ->with('success', 'Batch updated successfully.');
    }

    public function updateStatus(Request $request, Batch $batch)
    {
        $validated = $request->validate([
            'status' => 'required|in:scheduled,ongoing,completed,cancelled',
        ]);

        $batch->update(['status' => $validated['status']]);

        return back()->with('success', 'Batch status updated successfully.');
    }

    public function destroy(Batch $batch)
    {
        // Hanya bisa hapus batch yang belum dimulai
        if ($batch->status !== 'scheduled') {
            return back()->with('error', 'Cannot delete batch that has started.');
        }

        $batch->delete();
        
        return redirect()->back()->with('success', 'Batch berhasil dihapus');
    }
}