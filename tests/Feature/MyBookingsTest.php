<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MyBookingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/my-bookings')->assertRedirect('/login');
    }

    public function test_user_sees_bookings_by_user_id_and_by_matching_email_but_not_others(): void
    {
        $user = User::factory()->create(['email' => 'owner@example.com']);
        $other = User::factory()->create(['email' => 'other@example.com']);

        // Booked while signed in (user_id set, different contact email).
        $byAccount = Booking::factory()->create([
            'user_id' => $user->id,
            'customer_email' => 'someone-else@example.com',
            'travel_date' => now()->addMonth()->format('Y-m-d'),
        ]);

        // Booked as a guest, but with the account's email address.
        $byEmail = Booking::factory()->create([
            'user_id' => null,
            'customer_email' => 'owner@example.com',
            'travel_date' => now()->addMonths(2)->format('Y-m-d'),
        ]);

        // Someone else's booking must never show up.
        Booking::factory()->create([
            'user_id' => $other->id,
            'customer_email' => 'other@example.com',
            'travel_date' => now()->addMonths(3)->format('Y-m-d'),
        ]);

        $response = $this->actingAs($user)->get('/my-bookings');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Bookings/Mine')
            ->has('bookings', 2)
            // Sorted by travel_date desc: the later trip comes first.
            ->where('bookings.0.reference', $byEmail->reference)
            ->where('bookings.1.reference', $byAccount->reference)
            ->has('bookings.0.tour')
            ->has('bookings.0.tour.destination')
        );
    }

    public function test_user_with_no_bookings_gets_an_empty_list(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/my-bookings');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Bookings/Mine')
            ->has('bookings', 0)
        );
    }

    public function test_user_can_cancel_own_pending_future_booking(): void
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'status' => Booking::STATUS_PENDING,
            'travel_date' => now()->addWeek()->format('Y-m-d'),
        ]);

        $this->actingAs($user)
            ->from('/my-bookings')
            ->patch("/my-bookings/{$booking->reference}/cancel")
            ->assertRedirect('/my-bookings');

        $this->assertSame(Booking::STATUS_CANCELLED, $booking->fresh()->status);
    }

    public function test_user_can_cancel_guest_booking_made_with_their_email(): void
    {
        $user = User::factory()->create(['email' => 'guest-first@example.com']);
        $booking = Booking::factory()->create([
            'user_id' => null,
            'customer_email' => 'guest-first@example.com',
            'status' => Booking::STATUS_PENDING,
            'travel_date' => now()->addWeek()->format('Y-m-d'),
        ]);

        $this->actingAs($user)
            ->from('/my-bookings')
            ->patch("/my-bookings/{$booking->reference}/cancel")
            ->assertRedirect('/my-bookings');

        $this->assertSame(Booking::STATUS_CANCELLED, $booking->fresh()->status);
    }

    public function test_user_cannot_cancel_someone_elses_booking(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $booking = Booking::factory()->create([
            'user_id' => $other->id,
            'customer_email' => $other->email,
            'status' => Booking::STATUS_PENDING,
            'travel_date' => now()->addWeek()->format('Y-m-d'),
        ]);

        $this->actingAs($user)
            ->patch("/my-bookings/{$booking->reference}/cancel")
            ->assertForbidden();

        $this->assertSame(Booking::STATUS_PENDING, $booking->fresh()->status);
    }

    public function test_confirmed_booking_cannot_be_cancelled(): void
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->confirmed()->create([
            'user_id' => $user->id,
            'travel_date' => now()->addWeek()->format('Y-m-d'),
        ]);

        $this->actingAs($user)
            ->patch("/my-bookings/{$booking->reference}/cancel")
            ->assertStatus(422);

        $this->assertSame(Booking::STATUS_CONFIRMED, $booking->fresh()->status);
    }

    public function test_past_booking_cannot_be_cancelled(): void
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->create([
            'user_id' => $user->id,
            'status' => Booking::STATUS_PENDING,
            'travel_date' => now()->subDay()->format('Y-m-d'),
        ]);

        $this->actingAs($user)
            ->patch("/my-bookings/{$booking->reference}/cancel")
            ->assertStatus(422);

        $this->assertSame(Booking::STATUS_PENDING, $booking->fresh()->status);
    }

    public function test_guests_cannot_cancel_bookings(): void
    {
        $booking = Booking::factory()->create([
            'status' => Booking::STATUS_PENDING,
            'travel_date' => now()->addWeek()->format('Y-m-d'),
        ]);

        $this->patch("/my-bookings/{$booking->reference}/cancel")
            ->assertRedirect('/login');

        $this->assertSame(Booking::STATUS_PENDING, $booking->fresh()->status);
    }

    public function test_booking_made_while_logged_in_stores_the_user_id(): void
    {
        $user = User::factory()->create();
        $tour = Tour::factory()->create(['price' => 1000]);

        $this->actingAs($user)->post("/tours/{$tour->slug}/bookings", [
            'customer_name' => $user->name,
            'customer_email' => $user->email,
            'customer_phone' => '+20 100 123 4567',
            'travel_date' => now()->addWeek()->format('Y-m-d'),
            'adults' => 2,
            'children' => 0,
            'locale' => 'ar',
        ])->assertRedirect();

        $booking = Booking::first();
        $this->assertNotNull($booking);
        $this->assertSame($user->id, $booking->user_id);
    }
}
