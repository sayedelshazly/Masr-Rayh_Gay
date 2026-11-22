<?php

namespace Database\Factories;

use App\Models\Glyph;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Glyph>
 */
class GlyphFactory extends Factory
{
    public function definition(): array
    {
        return [
            'symbol' => fake()->randomElement(['𓄿', '𓃀', '𓅓', '𓈖', '𓂋', '𓋹', '𓂀']),
            'transliteration' => fake()->unique()->lexify('??'),
            'name_ar' => 'رمز '.fake()->word(),
            'name_en' => fake()->words(2, true),
            'meaning_ar' => 'معنى '.fake()->sentence(3),
            'meaning_en' => fake()->sentence(4),
            'category' => fake()->randomElement(Glyph::CATEGORIES),
            'pronunciation' => null,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function alphabet(): static
    {
        return $this->state(fn (array $attributes) => ['category' => 'alphabet']);
    }

    public function symbol(): static
    {
        return $this->state(fn (array $attributes) => ['category' => 'symbol']);
    }
}
