<?php

namespace Database\Factories;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizQuestion>
 */
class QuizQuestionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'lesson_id' => null,
            'question_ar' => 'سؤال '.fake()->sentence(4).'؟',
            'question_en' => fake()->sentence(5).'?',
            'options_ar' => ['إجابة أولى', 'إجابة ثانية', 'إجابة ثالثة', 'إجابة رابعة'],
            'options_en' => ['First answer', 'Second answer', 'Third answer', 'Fourth answer'],
            'correct_index' => 0,
            'explanation_ar' => 'شرح قصير للإجابة الصحيحة.',
            'explanation_en' => 'A short explanation of the correct answer.',
            'sort_order' => fake()->numberBetween(0, 20),
        ];
    }

    public function forLesson(Lesson $lesson): static
    {
        return $this->state(fn (array $attributes) => ['lesson_id' => $lesson->id]);
    }

    public function general(): static
    {
        return $this->state(fn (array $attributes) => ['lesson_id' => null]);
    }
}
