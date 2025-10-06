<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaxRatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tax_rates')->truncate(); // clears existing rows

        DB::table('tax_rates')->insert([
            ['category' => 'VAT', 'rate' => 0.15, 'effective_date' => '2023-01-01'],
            ['category' => 'Withholding_Royalties', 'rate' => 0.15, 'effective_date' => '2023-01-01'],
            ['category' => 'Withholding_Fees', 'rate' => 0.20, 'effective_date' => '2023-01-01'],
            ['category' => 'Withholding_Interest', 'rate' => 0.10, 'effective_date' => '2023-01-01'],
            ['category' => 'Withholding_Tenders', 'rate' => 0.30, 'effective_date' => '2023-01-01'],
            ['category' => 'Corporate_Income', 'rate' => 0.24, 'effective_date' => '2023-01-01'],
            ['category' => 'Individual_Income', 'rate' => 0.24, 'effective_date' => '2023-01-01'],

            // new
            ['category' => 'Agriculture', 'rate' => 0.10, 'effective_date' => '2023-01-01'],
            ['category' => 'Insurance', 'rate' => 0.05, 'effective_date' => '2023-01-01'],
            ['category' => 'Financial', 'rate' => 0.03, 'effective_date' => '2023-01-01'],
            ['category' => 'Healthcare', 'rate' => 0.20, 'effective_date' => '2023-01-01'],
        ]);
    }

}
