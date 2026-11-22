<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('glyphs', function (Blueprint $table) {
            $table->id();
            $table->string('symbol', 16);
            $table->string('transliteration', 32)->index();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('meaning_ar');
            $table->string('meaning_en');
            $table->string('category', 32)->index(); // alphabet | symbol | number
            $table->string('pronunciation')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_ar');
            $table->string('title_en');
            $table->text('summary_ar');
            $table->text('summary_en');
            $table->json('content_ar'); // [{heading, body}, ...]
            $table->json('content_en');
            $table->string('level', 32)->default('beginner')->index(); // beginner | intermediate
            $table->unsignedInteger('sort_order')->default(0);
            $table->unsignedInteger('estimated_minutes')->default(5);
            $table->timestamps();
        });

        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->nullable()->constrained()->nullOnDelete(); // null = general quiz
            $table->string('question_ar');
            $table->string('question_en');
            $table->json('options_ar'); // 4 options
            $table->json('options_en');
            $table->unsignedTinyInteger('correct_index');
            $table->text('explanation_ar');
            $table->text('explanation_en');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('glyphs');
    }
};
