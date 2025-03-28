<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Rooms;


class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Rooms::insert([
            ["room_number" => 101, "living_quarters" => 4, "beds" => 2, "balcony" => true],
            ["room_number" => 102, "living_quarters" => 4, "beds" => 2, "balcony" => true],
            ["room_number" => 103, "living_quarters" => 4, "beds" => 2, "balcony" => true],
            ["room_number" => 104, "living_quarters" => 4, "beds" => 2, "balcony" => true],
            ["room_number" => 105, "living_quarters" => 4, "beds" => 2, "balcony" => true],
            ["room_number" => 106, "living_quarters" => 3, "beds" => 1, "balcony" => false],
            ["room_number" => 107, "living_quarters" => 3, "beds" => 1, "balcony" => false],
            ["room_number" => 108, "living_quarters" => 3, "beds" => 1, "balcony" => false],
            ["room_number" => 109, "living_quarters" => 3, "beds" => 1, "balcony" => false],
            ["room_number" => 110, "living_quarters" => 3, "beds" => 1, "balcony" => false]
        ]);
    }
}
