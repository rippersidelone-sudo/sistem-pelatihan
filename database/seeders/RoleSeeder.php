<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Master - HQ',
                'slug' => 'master-hq',
                'description' => 'Pengelola pusat dan pengendali seluruh sistem'
            ],
            [
                'name' => 'Training Coordinator',
                'slug' => 'training-coordinator',
                'description' => 'Pengatur jadwal, batch, dan peserta pelatihan'
            ],
            [
                'name' => 'Trainer',
                'slug' => 'trainer',
                'description' => 'Pelaksana kegiatan pelatihan'
            ],
            [
                'name' => 'Branch Coordinator',
                'slug' => 'branch-coordinator',
                'description' => 'Penanggung jawab peserta di tingkat cabang'
            ],
            [
                'name' => 'Participant',
                'slug' => 'participant',
                'description' => 'Peserta yang mengikuti pelatihan'
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
