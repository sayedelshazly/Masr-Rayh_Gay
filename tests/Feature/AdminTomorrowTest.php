<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminTomorrowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    private function booking(string $status, $date): Booking
    {
        $tour = Tour::where('slug', 'pyramids-egyptian-museum-day-tour')->firstOrFail();

        return Booking::create([
            'tour_id' => $tour->id,
            'customer_name' => 'Traveller '.uniqid(),
            'customer_email' => 't@example.com',
            'customer_phone' => '0109 968 7092',
            'travel_date' => $date,
            'adults' => 2,
            'children' => 0,
            'total_price' => 3700,
            'status' => $status,
        ]);
    }

    public function test_tomorrow_page_lists_only_confirmed_trips_for_tomorrow(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->booking(Booking::STATUS_CONFIRMED, now()->addDay());
        $this->booking(Booking::STATUS_PENDING, now()->addDay());
        $this->booking(Booking::STATUS_CONFIRMED, now()->addDays(3));
        $this->booking(Booking::STATUS_CONFIRMED, now());

        $this->actingAs($admin)
            ->get('/admin/tomorrow')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Tomorrow')
                ->where('date', now()->addDay()->toDateString())
                ->has('bookings', 1)
                ->where('totalTravellers', 2)
                ->where('bookings.0.whatsapp_reminder_url', fn ($url) => str_starts_with($url, 'https://wa.me/201099687092'))
            );
    }

    public function test_reminder_message_says_tomorrow_with_the_details(): void
    {
        $booking = $this->booking(Booking::STATUS_CONFIRMED, now()->addDay());
        $url = $booking->whatsappReminderUrl();
        $message = rawurldecode(substr($url, strpos($url, '?text=') + 6));
        $this->assertStringContainsString('بكرة', $message);
        $this->assertStringContainsString($booking->reference, $message);
        $this->assertStringContainsString('الأهرامات والمتحف المصري', $message);
    }

    public function test_guests_and_members_cannot_open_the_page(): void
    {
        $this->get('/admin/tomorrow')->assertRedirect('/login');
        $this->actingAs(User::factory()->create())->get('/admin/tomorrow')->assertForbidden();
    }
}
