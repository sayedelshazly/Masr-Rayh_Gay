<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminWhatsappTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    private function bookingWithPhone(string $phone): Booking
    {
        $tour = Tour::where('slug', 'pyramids-egyptian-museum-day-tour')->firstOrFail();

        return Booking::create([
            'tour_id' => $tour->id,
            'customer_name' => 'Mona Adel',
            'customer_email' => 'mona@example.com',
            'customer_phone' => $phone,
            'travel_date' => now()->addDays(5),
            'adults' => 2,
            'children' => 1,
            'total_price' => 4625,
            'status' => Booking::STATUS_PENDING,
        ]);
    }

    public function test_whatsapp_url_normalizes_egyptian_numbers_and_carries_the_details(): void
    {
        $booking = $this->bookingWithPhone('0109 968 7092');

        $url = $booking->whatsappUrl();
        $this->assertNotNull($url);
        $this->assertStringStartsWith('https://wa.me/201099687092?text=', $url);

        $message = rawurldecode(substr($url, strpos($url, '?text=') + 6));
        $this->assertStringContainsString('Mona Adel', $message);
        $this->assertStringContainsString($booking->reference, $message);
        $this->assertStringContainsString('الأهرامات والمتحف المصري', $message);
        $this->assertStringContainsString('عدد الأفراد: 3', $message);
        $this->assertStringContainsString('4,625', $message);
    }

    public function test_international_and_useless_numbers(): void
    {
        $this->assertStringStartsWith(
            'https://wa.me/201099687092',
            $this->bookingWithPhone('+20 109 968 7092')->whatsappUrl()
        );
        $this->assertNull($this->bookingWithPhone('123')->whatsappUrl());
    }

    public function test_admin_bookings_payload_includes_the_whatsapp_url(): void
    {
        $booking = $this->bookingWithPhone('01099687092');
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->get('/admin/bookings')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Bookings/Index')
                ->where('bookings.data.0.reference', $booking->reference)
                ->where('bookings.data.0.whatsapp_url', $booking->whatsappUrl())
            );

        $this->actingAs($admin)
            ->get("/admin/bookings/{$booking->reference}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('whatsappUrl', $booking->whatsappUrl())
            );
    }
}
