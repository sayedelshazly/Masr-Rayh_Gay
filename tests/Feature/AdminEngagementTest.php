<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Booking;
use App\Models\Review;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminEngagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    private function booking(array $overrides = []): Booking
    {
        $tour = Tour::where('slug', 'pyramids-egyptian-museum-day-tour')->firstOrFail();

        return Booking::create(array_merge([
            'tour_id' => $tour->id,
            'customer_name' => 'Mona Adel',
            'customer_email' => 'mona@example.com',
            'customer_phone' => '0109 968 7092',
            'travel_date' => now()->subDays(3),
            'adults' => 2,
            'children' => 0,
            'total_price' => 3700,
            'status' => Booking::STATUS_CONFIRMED,
        ], $overrides));
    }

    public function test_active_announcement_is_shared_and_inactive_is_not(): void
    {
        Announcement::singleton()->update([
            'text_ar' => 'خصم ١٥٪ على رحلات سيوة',
            'text_en' => '15% off Siwa trips',
            'link' => '/tours',
            'is_active' => false,
        ]);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('announcement', null));

        Announcement::singleton()->update(['is_active' => true]);
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('announcement.text_ar', 'خصم ١٥٪ على رحلات سيوة')
                ->where('announcement.link', '/tours')
            );
    }

    public function test_admin_can_update_the_announcement(): void
    {
        $this->actingAs($this->admin())
            ->put('/admin/announcement', [
                'text_ar' => 'بالون الأقصر متوقف بكرة',
                'text_en' => 'Luxor balloons are paused tomorrow',
                'link' => '',
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('announcements', ['text_ar' => 'بالون الأقصر متوقف بكرة', 'is_active' => 1]);
        $this->get('/admin/announcement')->assertOk();
        $this->actingAs(User::factory()->create())->get('/admin/announcement')->assertForbidden();
    }

    public function test_booking_exposes_all_whatsapp_templates(): void
    {
        $booking = $this->booking();
        $templates = $booking->whatsappTemplates();
        $this->assertSame(['confirm', 'remind', 'thanks', 'review'], array_keys($templates));

        $reviewMessage = rawurldecode(substr($templates['review'], strpos($templates['review'], '?text=') + 6));
        $this->assertStringContainsString('/booking/'.$booking->reference, $reviewMessage);
        $this->assertStringContainsString('قيّم رحلتك', $reviewMessage);

        $thanksMessage = rawurldecode(substr($templates['thanks'], strpos($templates['thanks'], '?text=') + 6));
        $this->assertStringContainsString('شكرًا لثقتك', $thanksMessage);
    }

    public function test_review_requests_lists_only_finished_unreviewed_trips(): void
    {
        $waiting = $this->booking();
        $reviewed = $this->booking();
        Review::create(['booking_id' => $reviewed->id, 'tour_id' => $reviewed->tour_id, 'author_name' => 'Mona Adel', 'body' => 'رحلة رائعة', 'rating' => 5, 'is_approved' => true]);
        $this->booking(['travel_date' => now()->addDays(2)]); // future trip
        $this->booking(['status' => Booking::STATUS_PENDING]); // not confirmed

        $this->actingAs($this->admin())
            ->get('/admin/review-requests')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/ReviewRequests/Index')
                ->has('bookings', 1)
                ->where('bookings.0.reference', $waiting->reference)
                ->where('bookings.0.whatsapp_review_url', fn ($url) => str_starts_with($url, 'https://wa.me/201099687092'))
            );
    }
}
