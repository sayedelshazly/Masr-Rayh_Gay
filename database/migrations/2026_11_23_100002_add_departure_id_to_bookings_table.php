<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A booking may target a scheduled departure (seat inventory) or
     * stay a free-date request (departure_id null — the original
     * pay-later flow where the team contacts the guest).
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->foreignId('departure_id')
                ->nullable()
                ->after('tour_id')
                ->constrained('tour_departures')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropConstrainedForeignId('departure_id');
        });
    }
};
