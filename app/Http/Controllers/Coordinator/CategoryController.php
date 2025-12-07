<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\TrainingCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search', '');
        $filter = $request->query('filter', 'all');
        $sort = $request->query('sort', 'latest');

        $query = TrainingCategory::with(['creator', 'prerequisites'])
            ->withCount('batches');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($filter === 'with') {
            $query->has('prerequisites');
        } elseif ($filter === 'without') {
            $query->doesntHave('prerequisites');
        }

        // Sorting logic
        switch ($sort) {
            case 'latest':
                $query->orderByDesc('created_at');
                break;
            case 'oldest':
                $query->orderBy('created_at');
                break;
            case 'name_asc':
                $query->orderBy('name');
                break;
            case 'name_desc':
                $query->orderByDesc('name');
                break;
            default:
                $query->orderByDesc('created_at');
        }

        $categories = $query->get();

        $stats = [
            'total' => TrainingCategory::count(),
            'with_prerequisite' => TrainingCategory::has('prerequisites')->count(),
            'without_prerequisite' => TrainingCategory::doesntHave('prerequisites')->count(),
        ];

        return Inertia::render('Coordinator/Categories/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'filter' => $filter,
                'sort' => $sort,
            ]
        ]);
    }

    public function create()
    {
        $categories = TrainingCategory::doesntHave('batches')->get();

        return Inertia::render('Coordinator/Categories/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:training_categories,name',
            'description' => 'nullable|string|max:1000',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => [
                'exists:training_categories,id',
                function ($attribute, $value, $fail) {
                    if ($value == request()->input('name') || 
                        TrainingCategory::where('id', $value)->value('name') === request()->input('name')) {
                        $fail('Kategori tidak boleh menjadi prerequisite dirinya sendiri.');
                    }
                },
            ],
        ]);

        $category = TrainingCategory::create([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by'  => auth()->id(),
        ]);

        if (!empty($validated['prerequisites'])) {
            $safePrerequisites = TrainingCategory::whereIn('id', $validated['prerequisites'])
                ->doesntHave('batches')
                ->pluck('id');

            $category->prerequisites()->attach($safePrerequisites);
        }

        return redirect()
            ->route('coordinator.categories.index')
            ->with('success', "Kategori \"{$category->name}\" berhasil dibuat!");
    }

    public function edit(TrainingCategory $category)
    {
        $category->load('prerequisites');

        $allCategories = TrainingCategory::where('id', '!=', $category->id)->get();

        return Inertia::render('Coordinator/Categories/Edit', [
            'category'      => $category,
            'allCategories' => $allCategories,
        ]);
    }

    public function update(Request $request, TrainingCategory $category)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:training_categories,name,' . $category->id,
            'description' => 'nullable|string|max:1000',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'exists:training_categories,id',
        ]);

        if (in_array($category->id, $validated['prerequisites'] ?? [])) {
            return back()->withErrors(['prerequisites' => 'Kategori tidak boleh menjadi prerequisite dirinya sendiri.']);
        }

        $category->update([
            'name'        => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        $safeIds = TrainingCategory::whereIn('id', $validated['prerequisites'] ?? [])
            ->where('id', '!=', $category->id)
            ->doesntHave('batches')
            ->pluck('id');

        $category->prerequisites()->sync($safeIds);

        return redirect()
            ->route('coordinator.categories.index')
            ->with('success', "Kategori \"{$category->name}\" berhasil diperbarui!");
    }

    public function show(TrainingCategory $category)
    {
        // Load relasi yang diperlukan
        $category->load([
            'creator',
            'prerequisites',
            'prerequisiteFor',
            'batches' => function($query) {
                $query->with(['trainer'])
                      ->withCount('participants')
                      ->latest('start_date');
            }
        ]);

        // Map batches untuk dikirim ke frontend
        $batches = $category->batches->map(function($batch) {
            return [
                'id' => $batch->id,
                'title' => $batch->title,
                'status' => $batch->status,
                'start_date' => $batch->start_date,
                'end_date' => $batch->end_date,
                'trainer' => $batch->trainer ? [
                    'id' => $batch->trainer->id,
                    'name' => $batch->trainer->full_name ?? $batch->trainer->name,
                ] : null,
                'participants_count' => $batch->participants_count ?? 0,
                'max_participants' => $batch->max_participants,
            ];
        });

        return Inertia::render('Coordinator/Categories/Show', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'created_at' => $category->created_at,
                'updated_at' => $category->updated_at,
                'creator' => $category->creator ? [
                    'name' => $category->creator->full_name ?? $category->creator->name,
                ] : null,
                'prerequisites' => $category->prerequisites,
                'prerequisite_for' => $category->prerequisiteFor,
            ],
            'batches' => $batches,
        ]);
    }

    public function destroy(TrainingCategory $category)
    {
        if ($category->batches()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus kategori yang sudah memiliki batch.');
        }

        if ($category->prerequisiteFor()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus kategori yang menjadi prerequisite kategori lain.');
        }

        $name = $category->name;
        $category->delete();

        return redirect()
            ->route('coordinator.categories.index')
            ->with('success', "Kategori \"$name\" berhasil dihapus.");
    }
}