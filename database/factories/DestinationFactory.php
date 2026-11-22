<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Destination>
 */
class DestinationFactory extends Factory
{
    public function definition(): array
    {
        $nameEn = fake()->unique()->city();

        return [
            'slug' => Str::slug($nameEn).'-'.fake()->unique()->numberBetween(1, 99999),
            'name_ar' => 'وجهة '.fake()->word(),
            'name_en' => $nameEn,
            'tagline_ar' => fake()->sentence(6),
            'tagline_en' => fake()->sentence(6),
            'description_ar' => fake()->paragraph(),
            'description_en' => fake()->paragraph(),
            'region' => fake()->randomElement(['nile_valley', 'red_sea', 'cairo', 'desert', 'mediterranean']),
            'gradient' => 'from-nile-800 via-sky-600 to-nile-950',
            'glyph' => '𓂀',
            'is_featured' => false,
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
}
