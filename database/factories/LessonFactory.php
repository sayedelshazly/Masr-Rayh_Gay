<?php

namespace Database\Factories;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lesson>
 */
class LessonFactory extends Factory
{
    public function definition(): array
    {
        $titleEn = fake()->unique()->sentence(4);

        $sections = fn (string $lang) => [
            ['heading' => $lang === 'ar' ? 'مقدمة' : 'Introduction', 'body' => $lang === 'ar' ? 'نص تعليمي قصير.' : 'A short educational paragraph.'],
            ['heading' => $lang === 'ar' ? 'التفاصيل' : 'Details', 'body' => $lang === 'ar' ? 'نص تعليمي آخر.' : 'Another educational paragraph.'],
        ];

        return [
            'slug' => Str::slug($titleEn).'-'.fake()->unique()->numberBetween(1, 99999),
            'title_ar' => 'درس '.fake()->sentence(3),
            'title_en' => $titleEn,
            'summary_ar' => fake()->sentence(10),
            'summary_en' => fake()->sentence(10),
            'content_ar' => $sections('ar'),
            'content_en' => $sections('en'),
            'level' => fake()->randomElement(Lesson::LEVELS),
            'sort_order' => fake()->numberBetween(0, 20),
            'estimated_minutes' => fake()->numberBetween(3, 12),
        ];
    }

    public function beginner(): static
    {
        return $this->state(fn (array $attributes) => ['level' => 'beginner']);
    }
}
