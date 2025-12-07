<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\BatchParticipant;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua batch participants
        $participants = BatchParticipant::all();

        if ($participants->isEmpty()) {
            $this->command->warn('Tidak ada batch participant! Jalankan seeder untuk Batch dan BatchParticipant terlebih dahulu.');
            return;
        }

        $statuses = ['validated', 'checked_in', 'absent'];

        foreach ($participants as $participant) {
            // Buat 1-3 attendance record per participant (untuk simulasi multiple sessions)
            $sessionCount = rand(1, 3);
            
            for ($i = 0; $i < $sessionCount; $i++) {
                $status = $statuses[array_rand($statuses)];
                
                $checkInTime = null;
                $validatedBy = null;
                $validatedAt = null;

                // Jika checked_in atau validated, buat check_in_time
                if ($status === 'checked_in' || $status === 'validated') {
                    $checkInTime = Carbon::now()->subDays(rand(0, 30))->addHours(rand(8, 16));
                }

                // Jika validated, tambahkan validator info
                if ($status === 'validated') {
                    $validatedBy = 1; // Assume trainer dengan ID 1
                    $validatedAt = $checkInTime ? $checkInTime->copy()->addMinutes(rand(5, 30)) : null;
                }

                Attendance::create([
                    'batch_participant_id' => $participant->id,
                    'check_in_time' => $checkInTime,
                    'status' => $status,
                    'notes' => $status === 'absent' ? 'Tidak hadir tanpa keterangan' : null,
                    'validated_by' => $validatedBy,
                    'validated_at' => $validatedAt,
                ]);
            }
        }

        $this->command->info('Attendance records berhasil dibuat!');
    }
}