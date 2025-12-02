<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('users')->get();
        
        // Get all users with their roles (TANPA branch dulu)
        $users = User::with(['role'])
            ->select('id', 'full_name', 'email', 'role_id', 'status')
            ->orderBy('created_at', 'desc')
            ->get();
        
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
        ]);
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
}