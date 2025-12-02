<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil role IDs
        $masterHqRole = Role::where('slug', 'master-hq')->first();
        $coordinatorRole = Role::where('slug', 'training-coordinator')->first();
        $trainerRole = Role::where('slug', 'trainer')->first();
        $branchRole = Role::where('slug', 'branch-coordinator')->first();
        $participantRole = Role::where('slug', 'participant')->first();

        // User Master HQ (Admin)
        User::create([
            'username' => 'admin',
            'email' => 'admin@training.com',
            'password' => Hash::make('password123'),
            'full_name' => 'Administrator System',
            'phone' => '081234567890',
            'role_id' => $masterHqRole->id,
            'status' => 'active',
        ]);

        // User Coordinator
        User::create([
            'username' => 'coordinator1',
            'email' => 'coordinator@training.com',
            'password' => Hash::make('password123'),
            'full_name' => 'John Coordinator',
            'phone' => '081234567891',
            'role_id' => $coordinatorRole->id,
            'status' => 'active',
        ]);

        // User Trainer
        User::create([
            'username' => 'trainer1',
            'email' => 'trainer1@training.com',
            'password' => Hash::make('password123'),
            'full_name' => 'Sarah Trainer',
            'phone' => '081234567892',
            'role_id' => $trainerRole->id,
            'status' => 'active',
        ]);

        User::create([
            'username' => 'trainer2',
            'email' => 'trainer2@training.com',
            'password' => Hash::make('password123'),
            'full_name' => 'Mike Trainer',
            'phone' => '081234567893',
            'role_id' => $trainerRole->id,
            'status' => 'active',
        ]);

        // User Branch Coordinator
        User::create([
            'username' => 'branch_denpasar',
            'email' => 'branch.denpasar@training.com',
            'password' => Hash::make('password123'),
            'full_name' => 'Wayan Branch',
            'phone' => '081234567894',
            'role_id' => $branchRole->id,
            'branch' => 'Denpasar',
            'status' => 'active',
        ]);

        User::create([
            'username' => 'branch_jakarta',
            'email' => 'branch.jakarta@training.com',
            'password' => Hash::make('password123'),
            'full_name' => 'Budi Branch',
            'phone' => '081234567895',
            'role_id' => $branchRole->id,
            'branch' => 'Jakarta',
            'status' => 'active',
        ]);

        // User Participant (Guru)
        User::create([
            'username' => 'teacher1',
            'email' => 'teacher1@training.com',
            'password' => Hash::make('password123'),
            'full_name' => 'Ani Teacher',
            'phone' => '081234567896',
            'role_id' => $participantRole->id,
            'branch' => 'Denpasar',
            'status' => 'active',
        ]);

        User::create([
            'username' => 'teacher2',
            'email' => 'teacher2@training.com',
            'password' => Hash::make('password123'),
            'full_name' => 'Budi Teacher',
            'phone' => '081234567897',
            'role_id' => $participantRole->id,
            'branch' => 'Jakarta',
            'status' => 'active',
        ]);

        User::create([
            'username' => 'teacher3',
            'email' => 'teacher3@training.com',
            'password' => Hash::make('password123'),
            'full_name' => 'Citra Teacher',
            'phone' => '081234567898',
            'role_id' => $participantRole->id,
            'branch' => 'Denpasar',
            'status' => 'active',
        ]);
    }
}
