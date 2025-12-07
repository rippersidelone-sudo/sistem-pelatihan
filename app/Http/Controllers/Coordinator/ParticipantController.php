<?php

namespace App\Http\Controllers\Coordinator;

use App\Http\Controllers\Controller;
use App\Models\BatchParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipantController extends Controller
{
    public function index(Request $request)
    {

        $query = BatchParticipant::with(['user', 'batch'])->latest();

        // Apply filters
        if ($request->has('search') && $request->search) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('full_name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('registration_status', $request->status);
        }

        $registrations = $query->get()->map(function($participant) {
            $participant->status = $participant->registration_status;
            return $participant;
        });

        // Calculate stats
        $stats = [
            'pending' => BatchParticipant::where('registration_status', 'pending')->count(),
            'approved' => BatchParticipant::where('registration_status', 'approved')->count(),
            'rejected' => BatchParticipant::where('registration_status', 'rejected')->count(),
        ];

        return Inertia::render('Coordinator/Participants/Index', [
            'registrations' => $registrations,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function approve($id)
    {
        $participant = BatchParticipant::findOrFail($id);
        $participant->update([
            'registration_status' => 'approved',
        ]);
        return redirect()->back()->with('success', 'Pendaftaran berhasil disetujui');
    }

    public function reject($id)
    {
        $participant = BatchParticipant::findOrFail($id);
        $participant->update([
            'registration_status' => 'rejected',
        ]);
        return redirect()->back()->with('success', 'Pendaftaran berhasil ditolak');
    }
}