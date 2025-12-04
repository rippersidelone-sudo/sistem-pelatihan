<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $roles = Role::withCount('users')->get();
        
        // Query users dengan filter
        $query = User::with(['role'])
            ->select('id', 'full_name', 'email', 'role_id', 'status')
            ->orderBy('created_at', 'desc');
        
        // Apply search filter
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('full_name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        
        // Apply role filter
        if ($request->has('role') && $request->role) {
            $query->where('role_id', $request->role);
        }
        
        // Paginate users
        $users = $query->paginate(10)->withQueryString();
        
        // Role counts for stats
        $roleStats = [
            'hq_curriculum_admin' => User::whereHas('role', fn($q) => $q->where('slug', 'master-hq'))->count(),
            'training_coordinator' => User::whereHas('role', fn($q) => $q->where('slug', 'training-coordinator'))->count(),
            'trainer' => User::whereHas('role', fn($q) => $q->where('slug', 'trainer'))->count(),
            'branch_pic' => User::whereHas('role', fn($q) => $q->where('slug', 'branch-coordinator'))->count(),
            'participant' => User::whereHas('role', fn($q) => $q->where('slug', 'participant'))->count(),
        ];

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'users' => $users,
            'roleStats' => $roleStats,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function create()
    {
        $permissions = Permission::all();
        
        return Inertia::render('Admin/Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:roles,slug',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully');
    }

    public function show(Role $role)
    {
        $role->load(['users' => function($query) {
            $query->select('id', 'full_name', 'email', 'role_id', 'status')
                  ->orderBy('full_name');
        }]);

        return Inertia::render('Admin/Roles/Show', [
            'role' => $role,
        ]);
    }

    public function edit(Role $role)
    {
        $role->load('permissions');
        $permissions = Permission::all();
        
        return Inertia::render('Admin/Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:roles,slug,' . $role->id,
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully');
    }
}