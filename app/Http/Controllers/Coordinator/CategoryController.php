<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\TrainingCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = TrainingCategory::with(['creator', 'prerequisites'])
            ->withCount('batches')
            ->latest()
            ->get();

        return Inertia::render('Coordinator/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $allCategories = TrainingCategory::all();

        return Inertia::render('Coordinator/Categories/Create', [
            'allCategories' => $allCategories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'exists:training_categories,id',
        ]);

        $category = TrainingCategory::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_by' => auth()->id(),
        ]);

        if (isset($validated['prerequisites'])) {
            $category->prerequisites()->attach($validated['prerequisites']);
        }

        return redirect()->route('coordinator.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function edit(TrainingCategory $category)
    {
        $category->load('prerequisites');
        $allCategories = TrainingCategory::where('id', '!=', $category->id)->get();

        return Inertia::render('Coordinator/Categories/Edit', [
            'category' => $category,
            'allCategories' => $allCategories,
        ]);
    }

    public function update(Request $request, TrainingCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'exists:training_categories,id',
        ]);

        $category->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
        ]);

        $category->prerequisites()->sync($validated['prerequisites'] ?? []);

        return redirect()->route('coordinator.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(TrainingCategory $category)
    {
        // Check if category has batches
        if ($category->batches()->exists()) {
            return back()->with('error', 'Cannot delete category with existing batches.');
        }

        $category->delete();

        return redirect()->route('coordinator.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
