<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\Attendance;
use App\Models\BatchParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $batchId = $request->input('batch_id');

        // Get all batches for dropdown
        $batches = Batch::orderBy('start_date', 'desc')
            ->get()
            ->map(function($batch) {
                return [
                    'id' => $batch->id,
                    'title' => $batch->title,
                    'start_date' => $batch->start_date,
                    'status' => $batch->status,
                ];
            });

        // Cek apakah ada data attendance
        $totalAttendances = Attendance::count();
        
        // Jika tidak ada data attendance, buat stats kosong tapi valid
        if ($totalAttendances === 0) {
            $stats = [
                'total_participants' => BatchParticipant::count(),
                'validated' => 0,
                'checked_in' => 0,
                'absent' => 0,
            ];
            $attendanceRate = 0;
            $batchAttendances = [];
            $attendanceDetails = [];
        } else {
            // Overall stats
            $attendanceQuery = Attendance::query();
            if ($batchId) {
                $attendanceQuery->whereHas('batchParticipant', function($q) use ($batchId) {
                    $q->where('batch_id', $batchId);
                });
            }

            $stats = [
                'total_participants' => $attendanceQuery->distinct('batch_participant_id')->count('batch_participant_id'),
                'validated' => $attendanceQuery->where('status', 'validated')->count(),
                'checked_in' => $attendanceQuery->where('status', 'checked_in')->count(),
                'absent' => $attendanceQuery->where('status', 'absent')->count(),
            ];

            // Attendance rate keseluruhan
            $totalCount = $attendanceQuery->count();
            $attendanceRate = $totalCount > 0 
                ? round(($stats['validated'] / $totalCount) * 100) 
                : 0;

            // Kehadiran per batch
            $batchAttendances = Batch::with(['participants.user'])
                ->when($batchId, function($q) use ($batchId) {
                    $q->where('id', $batchId);
                })
                ->get()
                ->map(function($batch) {
                    $totalParticipants = $batch->participants->count();
                    
                    // Hitung attendance dari tabel attendances
                    $validated = Attendance::whereHas('batchParticipant', function($q) use ($batch) {
                        $q->where('batch_id', $batch->id);
                    })->where('status', 'validated')->count();
                    
                    $checkedIn = Attendance::whereHas('batchParticipant', function($q) use ($batch) {
                        $q->where('batch_id', $batch->id);
                    })->where('status', 'checked_in')->count();

                    $attendanceRate = $totalParticipants > 0 
                        ? round(($validated / $totalParticipants) * 100) 
                        : 0;

                    return [
                        'id' => $batch->id,
                        'title' => $batch->title,
                        'validated' => $validated,
                        'checked_in' => $checkedIn,
                        'total' => $totalParticipants,
                        'attendance_rate' => $attendanceRate,
                    ];
                });

            // Detail kehadiran (tabel bawah)
            $attendanceDetails = Attendance::with(['batchParticipant.user', 'batchParticipant.batch'])
                ->when($batchId, function($q) use ($batchId) {
                    $q->whereHas('batchParticipant', function($query) use ($batchId) {
                        $query->where('batch_id', $batchId);
                    });
                })
                ->latest()
                ->get()
                ->map(function($attendance) {
                    return [
                        'id' => $attendance->id,
                        'name' => $attendance->batchParticipant->user->full_name ?? $attendance->batchParticipant->user->name,
                        'nip' => $attendance->batchParticipant->user->nip ?? '-',
                        'batch' => $attendance->batchParticipant->batch->title,
                        'branch' => $attendance->batchParticipant->user->branch ?? 'Jakarta Pusat',
                        'status' => $attendance->status,
                        'check_in_time' => $attendance->check_in_time,
                    ];
                });
        }

        return Inertia::render('Coordinator/Attendance/Index', [
            'batches' => $batches,
            'stats' => $stats,
            'attendanceRate' => $attendanceRate,
            'batchAttendances' => $batchAttendances,
            'attendanceDetails' => $attendanceDetails,
            'selectedBatchId' => $batchId,
        ]);
    }

    // Method untuk validasi attendance (jika diperlukan)
    public function validate($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->update([
            'status' => 'validated',
            'validated_by' => auth()->id(),
            'validated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Kehadiran berhasil divalidasi');
    }

    public function reject($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->update([
            'status' => 'absent',
            'validated_by' => auth()->id(),
            'validated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Kehadiran ditolak');
    }
}