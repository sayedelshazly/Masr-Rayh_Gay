<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Scheduled departures for a tour: a concrete date (and optional
     * start time) with a seat capacity and an optional price override.
     * Seats are consumed by pending + confirmed bookings.
     */
    public function up(): void
    {
        Schema::create('tour_departures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('time')->nullable();
            $table->unsignedSmallInteger('capacity');
            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['tour_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tour_departures');
    }
};
