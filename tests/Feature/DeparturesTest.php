<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\TourDeparture;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DeparturesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    private function tour(): Tour
    {
        return Tour::where('slug', 'pyramids-egyptian-museum-day-tour')->firstOrFail();
    }

    private function departureFor(Tour $tour, int $capacity = 10, ?float $price = null): TourDeparture
    {
        return TourDeparture::create([
            'tour_id' => $tour->id,
            'date' => now()->addDays(5)->toDateString(),
            'time' => '08:00',
            'capacity' => $capacity,
            'price' => $price,
            'is_active' => true,
        ]);
    }

    private function guestPayload(array $overrides = []): array
    {
        return array_merge([
            'customer_name' => 'Seat Tester',
            'customer_email' => 'seats@example.com',
            'customer_phone' => '0100 000 0000',
            'adults' => 2,
            'children' => 0,
            'locale' => 'en',
        ], $overrides);
    }

    public function test_tour_page_offers_upcoming_departures_with_remaining_seats(): void
    {
        $tour = $this->tour();
        $departure = $this->departureFor($tour, 10);

        $this->get(route('tours.show', $tour))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tours/Show')
                ->has('departures')
                ->where('departures', fn ($departures) => collect($departures)
                    ->contains(fn ($d) => $d['id'] === $departure->id
                        && $d['seats_remaining'] === 10
                        && $d['sold_out'] === false))
            );
    }

    public function test_booking_a_departure_consumes_seats_and_uses_its_price(): void
    {
        $tour = $this->tour();
        $departure = $this->departureFor($tour, 10, 2000.00);

        $response = $this->post(route('bookings.store', $tour), $this->guestPayload([
            'departure_id' => $departure->id,
            'adults' => 2,
            'children' => 1,
        ]));

        $booking = Booking::firstOrFail();
        $response->assertRedirect(route('bookings.show', $booking));
        $this->assertSame($departure->id, $booking->departure_id);
        $this->assertSame($departure->date->format('Y-m-d'), $booking->travel_date->format('Y-m-d'));
        // Override price rules: 2 adults + 1 child at 50% of 2000.
        $this->assertSame('5000.00', (string) $booking->total_price);
        $this->assertSame(7, $departure->fresh()->seatsRemaining());
    }

    public function test_booking_beyond_remaining_seats_is_rejected(): void
    {
        $tour = $this->tour();
        $departure = $this->departureFor($tour, 3);

        $this->post(route('bookings.store', $tour), $this->guestPayload([
            'departure_id' => $departure->id,
            'adults' => 4,
        ]))->assertSessionHasErrors('departure_id');

        $this->assertSame(0, Booking::count());
    }

    public function test_sold_out_departure_rejects_new_bookings(): void
    {
        $tour = $this->tour();
        $departure = $this->departureFor($tour, 2);

        Booking::create([
            'tour_id' => $tour->id,
            'departure_id' => $departure->id,
            'customer_name' => 'First',
            'customer_email' => 'first@example.com',
            'customer_phone' => '0100 000 0000',
            'travel_date' => $departure->date,
            'adults' => 2,
            'children' => 0,
            'total_price' => 3700,
            'status' => Booking::STATUS_CONFIRMED,
            'locale' => 'en',
        ]);

        $this->post(route('bookings.store', $tour), $this->guestPayload([
            'departure_id' => $departure->id,
            'adults' => 1,
        ]))->assertSessionHasErrors('departure_id');

        $this->assertSame(1, Booking::count());
    }

    public function test_departure_from_another_tour_is_rejected(): void
    {
        $tour = $this->tour();
        $other = Tour::where('slug', '!=', $tour->slug)->firstOrFail();
        $foreign = $this->departureFor($other, 10);

        $this->post(route('bookings.store', $tour), $this->guestPayload([
            'departure_id' => $foreign->id,
        ]))->assertSessionHasErrors('departure_id');

        $this->assertSame(0, Booking::count());
    }

    public function test_stale_pending_holds_expire_and_free_their_seats(): void
    {
        $tour = $this->tour();
        $departure = $this->departureFor($tour, 2);

        $stale = Booking::create([
            'tour_id' => $tour->id,
            'departure_id' => $departure->id,
            'customer_name' => 'Stale',
            'customer_email' => 'stale@example.com',
            'customer_phone' => '0100 000 0000',
            'travel_date' => $departure->date,
            'adults' => 2,
            'children' => 0,
            'total_price' => 3700,
            'status' => Booking::STATUS_PENDING,
            'locale' => 'en',
        ]);
        $stale->forceFill(['created_at' => now()->subMinutes(Booking::HOLD_MINUTES + 1)])->save();
        $freeDate = Booking::create([
            'tour_id' => $tour->id,
            'customer_name' => 'Free Date',
            'customer_email' => 'free@example.com',
            'customer_phone' => '0100 000 0000',
            'travel_date' => now()->addDays(9),
            'adults' => 1,
            'children' => 0,
            'total_price' => 1850,
            'status' => Booking::STATUS_PENDING,
            'locale' => 'en',
        ]);
        $freeDate->forceFill(['created_at' => now()->subHours(3)])->save();

        $this->assertSame(0, $departure->fresh()->seatsRemaining());

        Artisan::call('bookings:expire-holds');

        $this->assertSame(Booking::STATUS_EXPIRED, $stale->fresh()->status);
        $this->assertSame(2, $departure->fresh()->seatsRemaining());
        // Free-date bookings belong to the team follow-up flow: untouched.
        $this->assertSame(Booking::STATUS_PENDING, $freeDate->fresh()->status);
    }

    public function test_admin_manages_departures_but_guests_cannot(): void
    {
        $tour = $this->tour();
        $payload = [
            'date' => now()->addDays(7)->toDateString(),
            'time' => '09:30',
            'capacity' => 12,
            'price' => 2100,
        ];

        $this->post(route('admin.tours.departures.store', $tour), $payload)
            ->assertRedirect(route('login'));
        $this->assertSame(0, TourDeparture::whereDate('date', $payload['date'])->count());

        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin)
            ->post(route('admin.tours.departures.store', $tour), $payload)
            ->assertRedirect(route('admin.tours.edit', $tour));

        $departure = TourDeparture::whereDate('date', $payload['date'])->firstOrFail();
        $this->assertSame(12, $departure->capacity);

        $this->actingAs($admin)
            ->patch(route('admin.tours.departures.toggle', [$tour, $departure]))
            ->assertRedirect(route('admin.tours.edit', $tour));
        $this->assertFalse($departure->fresh()->is_active);

        $this->actingAs($admin)
            ->delete(route('admin.tours.departures.destroy', [$tour, $departure]))
            ->assertRedirect(route('admin.tours.edit', $tour));
        $this->assertSame(0, TourDeparture::whereKey($departure->id)->count());
    }
}
