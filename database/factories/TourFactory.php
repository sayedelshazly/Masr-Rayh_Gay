<?php

namespace Database\Factories;

use App\Models\Destination;
use App\Models\Tour;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tour>
 */
class TourFactory extends Factory
{
    public function definition(): array
    {
        $titleEn = fake()->unique()->sentence(4);

        return [
            'destination_id' => Destination::factory(),
            'slug' => Str::slug($titleEn).'-'.fake()->unique()->numberBetween(1, 99999),
            'title_ar' => 'رحلة '.fake()->sentence(3),
            'title_en' => $titleEn,
            'summary_ar' => fake()->sentence(10),
            'summary_en' => fake()->sentence(10),
            'description_ar' => fake()->paragraphs(2, true),
            'description_en' => fake()->paragraphs(2, true),
            'duration_days' => fake()->numberBetween(1, 5),
            'duration_nights' => null,
            'price' => fake()->numberBetween(800, 15000),
            'currency' => 'EGP',
            'old_price' => null,
            'rating' => fake()->randomFloat(1, 4.2, 5.0),
            'reviews_count' => fake()->numberBetween(10, 500),
            'type' => fake()->randomElement(Tour::TYPES),
            'is_featured' => false,
            'is_active' => true,
            'includes_ar' => ['مرشد سياحي معتمد', 'الانتقالات', 'تذاكر الدخول'],
            'includes_en' => ['Licensed tour guide', 'Transfers', 'Entrance tickets'],
            'meeting_point_ar' => 'القاهرة',
            'meeting_point_en' => 'Cairo',
        ];
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
