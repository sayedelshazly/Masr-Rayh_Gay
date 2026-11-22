<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'customer_name' => 'Ahmed Mohamed',
            'customer_email' => 'ahmed@example.com',
            'customer_phone' => '+20 100 123 4567',
            'travel_date' => now()->addWeek()->format('Y-m-d'),
            'adults' => 2,
            'children' => 0,
            'notes' => null,
            'locale' => 'ar',
        ], $overrides);
    }

    public function test_booking_checkout_page_returns_200_with_tour_and_initial_values(): void
    {
        $tour = Tour::factory()->create(['price' => 1000]);

        $response = $this->get("/tours/{$tour->slug}/book?travel_date=".now()->addDays(3)->format('Y-m-d').'&adults=3&children=1');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Bookings/Create')
            ->where('tour.id', $tour->id)
            ->where('initial.adults', 3)
            ->where('initial.children', 1)
        );
    }

    public function test_valid_booking_creates_row_with_computed_total_reference_and_redirects_to_confirmation(): void
    {
        $tour = Tour::factory()->create(['price' => 1000]);

        $response = $this->post("/tours/{$tour->slug}/bookings", $this->validPayload([
            'adults' => 2,
            'children' => 0,
            // A forged client-side total must be ignored entirely.
            'total_price' => 1,
        ]));

        $this->assertDatabaseCount('bookings', 1);

        $booking = Booking::first();
        $this->assertSame($tour->id, $booking->tour_id);
        $this->assertNull($booking->user_id);
        $this->assertMatchesRegularExpression('/^MRG-[A-Z0-9]{6}$/', $booking->reference);
        $this->assertSame('2000.00', (string) $booking->total_price);
        $this->assertSame(Booking::STATUS_PENDING, $booking->status);

        $response->assertRedirect("/booking/{$booking->reference}");
    }

    public function test_children_pay_half_price_in_computed_total(): void
    {
        $tour = Tour::factory()->create(['price' => 1000]);

        $this->post("/tours/{$tour->slug}/bookings", $this->validPayload([
            'adults' => 2,
            'children' => 2,
        ]))->assertRedirect();

        // 2 × 1000 + 2 × (1000 × 0.5) = 3000
        $this->assertSame('3000.00', (string) Booking::first()->total_price);
    }

    public function test_confirmation_page_returns_200_and_shows_the_reference(): void
    {
        $booking = Booking::factory()->create();

        $response = $this->get("/booking/{$booking->reference}");

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Bookings/Show')
            ->where('booking.reference', $booking->reference)
            ->where('booking.id', $booking->id)
            ->has('booking.tour')
        );
    }

    public function test_confirmation_page_404s_for_unknown_reference(): void
    {
        $this->get('/booking/MRG-XXXXXX')->assertNotFound();
    }

    public function test_invalid_booking_data_returns_validation_errors_and_creates_nothing(): void
    {
        $tour = Tour::factory()->create();

        $response = $this->post("/tours/{$tour->slug}/bookings", $this->validPayload([
            'travel_date' => now()->subDay()->format('Y-m-d'),
            'customer_email' => 'not-an-email',
            'adults' => 0,
        ]));

        $response->assertSessionHasErrors(['travel_date', 'customer_email', 'adults']);
        $this->assertDatabaseCount('bookings', 0);
    }

    public function test_booking_an_inactive_tour_404s(): void
    {
        $tour = Tour::factory()->inactive()->create();

        $this->get("/tours/{$tour->slug}/book")->assertNotFound();

        $this->post("/tours/{$tour->slug}/bookings", $this->validPayload())->assertNotFound();

        $this->assertDatabaseCount('bookings', 0);
    }
}
