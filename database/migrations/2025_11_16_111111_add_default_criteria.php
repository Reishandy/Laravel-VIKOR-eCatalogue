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
        // Insert default criteria
        $defaultCriteria = [
            [
                'name' => 'Price',
                'description' => 'Total price of the item',
                'type' => 'cost',
                'max_value' => -1, // Unlimited
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('criteria')->insert($defaultCriteria);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the default criteria when rolling back
        DB::table('criteria')->whereIn('name', ['Price'])->delete();
    }
};
