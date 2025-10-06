<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tax_rates', function (Blueprint $table) {
            $table->id();
            $table->string('category')->unique(); // Tax category (e.g., 'VAT', 'Corporate Income')
            $table->decimal('rate', 5, 4); // Tax rate (e.g., 0.15 for 15%)
            $table->date('effective_date'); // Date when the rate becomes effective
            $table->timestamps(); // created_at and updated_at columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_rates');
    }
};