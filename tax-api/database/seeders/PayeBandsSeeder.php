<?php

// database/seeders/PayeBandsSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PayeBandsSeeder extends Seeder
{
    public function run()
    {
        DB::table('paye_bands')->insert([
            ['min_income' => 0, 'max_income' => 100, 'rate' => 0.00, 'deduct' => 0],
            ['min_income' => 100.01, 'max_income' => 300, 'rate' => 0.20, 'deduct' => 20],
            ['min_income' => 300.01, 'max_income' => 1000, 'rate' => 0.25, 'deduct' => 35],
            ['min_income' => 1000.01, 'max_income' => 2000, 'rate' => 0.30, 'deduct' => 85],
            ['min_income' => 2000.01, 'max_income' => 3000, 'rate' => 0.35, 'deduct' => 185],
            ['min_income' => 3000.01, 'max_income' => null, 'rate' => 0.40, 'deduct' => 335],
        ]);
    }
}