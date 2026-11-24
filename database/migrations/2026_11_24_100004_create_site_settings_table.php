<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('whatsapp_number', 32)->nullable();
            $table->string('contact_email')->nullable();
            $table->unsignedSmallInteger('hold_minutes')->default(15);
            $table->boolean('reviews_enabled')->default(true);
            $table->boolean('photos_enabled')->default(true);
            $table->boolean('film_enabled')->default(true);
            $table->boolean('plan_enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
