<?php

// database/migrations/xxxx_xx_xx_create_paye_bands_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayeBandsTable extends Migration
{
    public function up()
    {
        Schema::create('paye_bands', function (Blueprint $table) {
            $table->id();
            $table->decimal('min_income', 10, 2);
            $table->decimal('max_income', 10, 2)->nullable();
            $table->decimal('rate', 5, 2);
            $table->decimal('deduct', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('paye_bands');
    }
}