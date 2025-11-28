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
        Schema::table('criterion_item', function (Blueprint $table) {
            // Increase precision to support large integer values (e.g., multi-million prices)
            $table->decimal('value', 20, 6)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('criterion_item', function (Blueprint $table) {
            // Revert back to default decimal precision if needed
            $table->decimal('value', 8, 2)->change();
        });
    }
};

