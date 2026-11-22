<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tour_id' => Tour::factory(),
            'user_id' => null,
            'customer_name' => fake()->name(),
            'customer_email' => fake()->unique()->safeEmail(),
            'customer_phone' => '+20 1'.fake()->numerify('#########'),
            'travel_date' => fake()->dateTimeBetween('+1 week', '+3 months')->format('Y-m-d'),
            'adults' => 2,
            'children' => 0,
            'total_price' => 0,
            'status' => Booking::STATUS_PENDING,
            'notes' => null,
            'locale' => 'ar',
        ];
    }

    public function configure(): static
    {
        // Keep the stored total honest: always recompute it from the tour's
        // price and the guest counts using the server-side price rule.
        return $this->afterCreating(function (Booking $booking) {
            $booking->forceFill([
                'total_price' => Booking::calculateTotal($booking->tour, $booking->adults, $booking->children),
            ])->saveQuietly();
        });
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Booking::STATUS_CONFIRMED,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => Booking::STATUS_CANCELLED,
        ]);
    }
}
