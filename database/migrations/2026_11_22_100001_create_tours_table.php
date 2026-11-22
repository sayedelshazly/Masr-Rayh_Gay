<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('title_ar');
            $table->string('title_en');
            $table->string('summary_ar')->nullable();
            $table->string('summary_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->unsignedInteger('duration_days')->default(1);
            $table->unsignedInteger('duration_nights')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('currency', 3)->default('EGP');
            $table->decimal('old_price', 10, 2)->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->unsignedInteger('reviews_count')->default(0);
            $table->string('type')->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->json('includes_ar')->nullable();
            $table->json('includes_en')->nullable();
            $table->string('meeting_point_ar')->nullable();
            $table->string('meeting_point_en')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
