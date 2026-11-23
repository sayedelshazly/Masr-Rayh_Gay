<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tailor-made trip requests from the "Design your trip" page:
     * the traveller sketches the journey (destinations, days,
     * party, budget, interests) and the team answers with a plan.
     */
    public function up(): void
    {
        Schema::create('trip_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->json('destinations');
            $table->date('start_date')->nullable();
            $table->unsignedSmallInteger('days')->default(3);
            $table->unsignedSmallInteger('adults')->default(2);
            $table->unsignedSmallInteger('children')->default(0);
            $table->string('budget')->nullable();
            $table->json('interests')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('new');
            $table->string('locale', 5)->default('ar');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trip_requests');
    }
};
