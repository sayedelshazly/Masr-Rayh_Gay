<?php

namespace Database\Factories;

use App\Models\Tour;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TourItineraryDay>
 */
class TourItineraryDayFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tour_id' => Tour::factory(),
            'day_number' => 1,
            'title_ar' => 'يوم '.fake()->sentence(3),
            'title_en' => fake()->sentence(4),
            'description_ar' => fake()->paragraph(),
            'description_en' => fake()->paragraph(),
        ];
    }
}
