<?php

// routes/web.php
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Admin Controllers
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\RoleController as AdminRoleController;
use App\Http\Controllers\Admin\BatchController as AdminBatchController;


// Coordinator Controllers
use App\Http\Controllers\Coordinator\DashboardController as CoordinatorDashboardController;
use App\Http\Controllers\Coordinator\CategoryController;
use App\Http\Controllers\Coordinator\BatchController;
use App\Http\Controllers\Coordinator\ParticipantController;
use App\Http\Controllers\Coordinator\AttendanceController as CoordinatorAttendanceController;
use App\Http\Controllers\Coordinator\ReportsController;

// Trainer Controllers
use App\Http\Controllers\Trainer\DashboardController as TrainerDashboardController;
use App\Http\Controllers\Trainer\AttendanceController;
use App\Http\Controllers\Trainer\SubmissionController;
use App\Http\Controllers\Trainer\MaterialController;

// Branch Controllers
use App\Http\Controllers\Branch\DashboardController as BranchDashboardController;

// Participant Controllers
use App\Http\Controllers\Participant\DashboardController as ParticipantDashboardController;
use App\Http\Controllers\Participant\RegistrationController;
use App\Http\Controllers\Participant\FeedbackController;

// ========================================
// ROOT ROUTE - Redirect based on auth status
// ========================================
Route::get('/', function () {
    if (auth()->check()) {
        // If logged in, redirect to appropriate dashboard based on role
        $user = auth()->user();
        
        return match($user->role->slug) {
            'master-hq' => redirect()->route('admin.dashboard'),
            'training-coordinator' => redirect()->route('coordinator.dashboard'),
            'trainer' => redirect()->route('trainer.dashboard'),
            'branch-coordinator' => redirect()->route('branch.dashboard'),
            'participant' => redirect()->route('participant.dashboard'),
            default => redirect()->route('login')
        };
    }
    
    // If not logged in, redirect to login
    return redirect()->route('login');
});

// ========================================
// ADMIN / MASTER HQ ROUTES
// ========================================
Route::middleware(['auth', 'role:master-hq'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // User Management
    Route::resource('users', AdminUserController::class);
    Route::patch('users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
    
    // Reports & Analytics
    Route::get('reports', [AdminDashboardController::class, 'reports'])->name('reports');
    Route::get('reports/export', [AdminDashboardController::class, 'exportReport'])->name('reports.export');

    // Batch Oversight
    Route::get('batches', [AdminBatchController::class, 'index'])->name('batches.index');
    Route::get('batches/{batch}', [AdminBatchController::class, 'show'])->name('batches.show');

    Route::get('roles', [AdminRoleController::class, 'index'])->name('roles.index');
    Route::get('roles/create', [AdminRoleController::class, 'create'])->name('roles.create');
    Route::post('roles', [AdminRoleController::class, 'store'])->name('roles.store');
    Route::get('roles/{role}', [AdminRoleController::class, 'show'])->name('roles.show');
    Route::get('roles/{role}/edit', [AdminRoleController::class, 'edit'])->name('roles.edit');
    Route::put('roles/{role}', [AdminRoleController::class, 'update'])->name('roles.update');
    Route::patch('roles/users/{user}', [AdminRoleController::class, 'update'])->name('roles.users.update');
    Route::delete('roles/users/{user}', [AdminRoleController::class, 'destroy'])->name('roles.users.destroy'); 
});

// ========================================
// COORDINATOR ROUTES
// ========================================
Route::middleware(['auth', 'role:training-coordinator'])
    ->prefix('coordinator')
    ->name('coordinator.')
    ->group(function () {

    // Dashboard
    Route::get('/dashboard', [CoordinatorDashboardController::class, 'index'])
        ->name('dashboard');

    // Kategori & Batch
    Route::resource('categories', CategoryController::class);
    Route::resource('batches', BatchController::class);
    Route::patch('batches/{batch}/status', [BatchController::class, 'updateStatus'])
        ->name('batches.status');

    // Peserta
    Route::prefix('participants')->name('participants.')->group(function () {
        Route::get('/', [ParticipantController::class, 'index'])->name('index');
        Route::patch('{participant}/approve', [ParticipantController::class, 'approve'])->name('approve');
        Route::patch('{participant}/reject',  [ParticipantController::class, 'reject'])->name('reject');
    });

    // Attendance monitoring
    Route::prefix('attendance')->name('attendance.')->group(function () {
        Route::get('/', [CoordinatorAttendanceController::class, 'index'])->name('index');
        Route::post('{id}/validate', [CoordinatorAttendanceController::class, 'validate'])->name('validate');
        Route::post('{id}/reject', [CoordinatorAttendanceController::class, 'reject'])->name('reject');
    });

    // Reports
    Route::get('reports', [ReportsController::class, 'index'])->name('reports.index');
});

// ========================================
// TRAINER ROUTES
// ========================================
Route::middleware(['auth', 'role:trainer'])->prefix('trainer')->name('trainer.')->group(function () {
    Route::get('/dashboard', [TrainerDashboardController::class, 'index'])->name('dashboard');
    
    // My Batches
    Route::get('batches', [TrainerDashboardController::class, 'batches'])->name('batches.index');
    Route::get('batches/{batch}', [TrainerDashboardController::class, 'show'])->name('batches.show');
    
    // Attendance Validation
    Route::get('batches/{batch}/attendances', [AttendanceController::class, 'index'])->name('attendances.index');
    Route::patch('attendances/{attendance}/validate', [AttendanceController::class, 'validate'])->name('attendances.validate');
    
    // Submission Review
    Route::get('batches/{batch}/submissions', [SubmissionController::class, 'index'])->name('submissions.index');
    Route::patch('submissions/{submission}/review', [SubmissionController::class, 'review'])->name('submissions.review');
    
    // Materials Upload
    Route::get('batches/{batch}/materials', [MaterialController::class, 'index'])->name('materials.index');
    Route::post('batches/{batch}/materials', [MaterialController::class, 'store'])->name('materials.store');
    Route::delete('materials/{material}', [MaterialController::class, 'destroy'])->name('materials.destroy');
    
    // Feedback Response
    Route::get('batches/{batch}/feedbacks', [TrainerDashboardController::class, 'feedbacks'])->name('feedbacks.index');
    Route::patch('feedbacks/{feedback}/respond', [TrainerDashboardController::class, 'respondFeedback'])->name('feedbacks.respond');
});

// ========================================
// BRANCH COORDINATOR ROUTES
// ========================================
Route::middleware(['auth', 'role:branch-coordinator'])->prefix('branch')->name('branch.')->group(function () {
    Route::get('/dashboard', [BranchDashboardController::class, 'index'])->name('dashboard');
    
    // Branch Participants Monitoring
    Route::get('participants', [BranchDashboardController::class, 'participants'])->name('participants.index');
    Route::get('participants/{participant}', [BranchDashboardController::class, 'showParticipant'])->name('participants.show');
    
    // Branch Reports
    Route::get('reports', [BranchDashboardController::class, 'reports'])->name('reports');
});

// ========================================
// PARTICIPANT ROUTES
// ========================================
Route::middleware(['auth', 'role:participant'])->prefix('participant')->name('participant.')->group(function () {
    Route::get('/dashboard', [ParticipantDashboardController::class, 'index'])->name('dashboard');
    
    // Browse & Register Training
    Route::get('trainings', [RegistrationController::class, 'index'])->name('trainings.index');
    Route::post('trainings/{batch}/register', [RegistrationController::class, 'register'])->name('trainings.register');
    
    // My Trainings
    Route::get('my-trainings', [ParticipantDashboardController::class, 'myTrainings'])->name('trainings.my');
    Route::get('my-trainings/{batch}', [ParticipantDashboardController::class, 'showTraining'])->name('trainings.show');
    
    // Check-in Attendance
    Route::post('batches/{batch}/check-in', [ParticipantDashboardController::class, 'checkIn'])->name('attendance.check-in');
    
    // Submission
    Route::post('batches/{batch}/submit', [ParticipantDashboardController::class, 'submitAssignment'])->name('submission.submit');
    
    // Feedback
    Route::post('batches/{batch}/feedback', [FeedbackController::class, 'store'])->name('feedback.store');
    
    // Training History
    Route::get('history', [ParticipantDashboardController::class, 'history'])->name('history');
});

// ========================================
// SHARED ROUTES (All Authenticated Users)
// ========================================
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';