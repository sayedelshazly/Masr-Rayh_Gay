<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Destination;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->admin()->create();
    }

    private function validTourPayload(array $overrides = []): array
    {
        return array_merge([
            'destination_id' => Destination::factory()->create()->id,
            'slug' => '',
            'title_ar' => 'رحلة الأهرامات',
            'title_en' => 'Pyramids Day Trip',
            'summary_ar' => 'ملخص الرحلة',
            'summary_en' => 'Trip summary',
            'description_ar' => 'وصف الرحلة بالعربية',
            'description_en' => 'Trip description in English',
            'duration_days' => 1,
            'duration_nights' => 0,
            'price' => 1500,
            'old_price' => 2000,
            'type' => 'cultural',
            'rating' => 4.8,
            'reviews_count' => 25,
            'includes_ar' => "مرشد سياحي\nالانتقالات",
            'includes_en' => "Tour guide\nTransfers",
            'meeting_point_ar' => 'ميدان التحرير',
            'meeting_point_en' => 'Tahrir Square',
            'is_featured' => true,
            'is_active' => true,
        ], $overrides);
    }

    // ——— Access control ———

    public function test_guests_are_redirected_to_login_from_admin(): void
    {
        $this->get('/admin')->assertRedirect('/login');
        $this->get('/admin/bookings')->assertRedirect('/login');
        $this->get('/admin/tours')->assertRedirect('/login');
    }

    public function test_non_admin_users_get_403_on_admin(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/admin')->assertForbidden();
        $this->actingAs($user)->get('/admin/bookings')->assertForbidden();
        $this->actingAs($user)->get('/admin/tours')->assertForbidden();
        $this->actingAs($user)->get('/admin/destinations')->assertForbidden();
    }

    // ——— Dashboard ———

    public function test_admin_dashboard_shows_server_side_stats(): void
    {
        $admin = $this->admin();
        $tour = Tour::factory()->create(['price' => 1000]);

        Booking::factory()->confirmed()->create(['tour_id' => $tour->id, 'adults' => 2, 'children' => 0]); // 2000
        Booking::factory()->create(['tour_id' => $tour->id, 'adults' => 1, 'children' => 0]); // pending
        Booking::factory()->cancelled()->create(['tour_id' => $tour->id]);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard')
            ->where('stats.total_bookings', 3)
            ->where('stats.pending_bookings', 1)
            ->where('stats.confirmed_revenue', 2000)
            ->where('stats.total_tours', 1)
            ->where('stats.total_users', 1)
            ->has('stats.total_destinations')
            ->has('recentBookings', 3)
            ->has('bookingsByStatus', 4)
            ->where('bookingsByStatus.0.status', 'pending')
            ->where('bookingsByStatus.1.count', 1)
        );
    }

    // ——— Bookings management ———

    public function test_admin_bookings_list_filters_by_status(): void
    {
        $admin = $this->admin();
        Booking::factory()->confirmed()->create();
        Booking::factory()->create(); // pending
        Booking::factory()->create(); // pending

        $response = $this->actingAs($admin)->get('/admin/bookings?status=confirmed');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Bookings/Index')
            ->has('bookings.data', 1)
            ->where('bookings.data.0.status', Booking::STATUS_CONFIRMED)
            ->where('filters.status', 'confirmed')
        );
    }

    public function test_admin_bookings_list_searches_by_reference_and_email(): void
    {
        $admin = $this->admin();
        $target = Booking::factory()->create(['customer_email' => 'find-me@example.com']);
        Booking::factory()->create(['customer_email' => 'someone-else@example.com']);

        $this->actingAs($admin)
            ->get('/admin/bookings?search=find-me')
            ->assertInertia(fn (Assert $page) => $page
                ->has('bookings.data', 1)
                ->where('bookings.data.0.reference', $target->reference)
            );

        $this->actingAs($admin)
            ->get('/admin/bookings?search='.substr($target->reference, 4, 3))
            ->assertInertia(fn (Assert $page) => $page->has('bookings.data', 1));
    }

    public function test_admin_can_view_booking_detail(): void
    {
        $admin = $this->admin();
        $booking = Booking::factory()->create();

        $this->actingAs($admin)
            ->get("/admin/bookings/{$booking->reference}")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Bookings/Show')
                ->where('booking.reference', $booking->reference)
                ->has('booking.tour')
                ->has('booking.tour.destination')
            );
    }

    public function test_admin_can_change_booking_status(): void
    {
        $admin = $this->admin();
        $booking = Booking::factory()->create(['status' => Booking::STATUS_PENDING]);

        $this->actingAs($admin)
            ->from("/admin/bookings/{$booking->reference}")
            ->patch("/admin/bookings/{$booking->reference}/status", ['status' => 'confirmed'])
            ->assertRedirect("/admin/bookings/{$booking->reference}");

        $this->assertSame(Booking::STATUS_CONFIRMED, $booking->fresh()->status);
    }

    public function test_admin_booking_status_change_rejects_invalid_status(): void
    {
        $admin = $this->admin();
        $booking = Booking::factory()->create(['status' => Booking::STATUS_PENDING]);

        $this->actingAs($admin)
            ->patch("/admin/bookings/{$booking->reference}/status", ['status' => 'refunded'])
            ->assertSessionHasErrors('status');

        $this->assertSame(Booking::STATUS_PENDING, $booking->fresh()->status);
    }

    public function test_non_admin_cannot_change_booking_status(): void
    {
        $user = User::factory()->create();
        $booking = Booking::factory()->create(['status' => Booking::STATUS_PENDING]);

        $this->actingAs($user)
            ->patch("/admin/bookings/{$booking->reference}/status", ['status' => 'confirmed'])
            ->assertForbidden();

        $this->assertSame(Booking::STATUS_PENDING, $booking->fresh()->status);
    }

    // ——— Tours management ———

    public function test_admin_tours_list_includes_inactive_tours(): void
    {
        $admin = $this->admin();
        Tour::factory()->create();
        Tour::factory()->inactive()->create();

        $this->actingAs($admin)
            ->get('/admin/tours')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Tours/Index')
                ->has('tours', 2)
            );
    }

    public function test_admin_creates_tour_and_it_appears_on_public_tours_page(): void
    {
        $admin = $this->admin();

        $response = $this->actingAs($admin)->post('/admin/tours', $this->validTourPayload());

        $tour = Tour::first();
        $this->assertNotNull($tour);
        $response->assertRedirect(route('admin.tours.edit', $tour));

        // Slug auto-generated from the English title.
        $this->assertSame('pyramids-day-trip', $tour->slug);
        $this->assertSame('رحلة الأهرامات', $tour->title_ar);
        // One-per-line includes were converted to arrays.
        $this->assertSame(['مرشد سياحي', 'الانتقالات'], $tour->includes_ar);
        $this->assertSame(['Tour guide', 'Transfers'], $tour->includes_en);
        $this->assertTrue($tour->is_active);

        // And it is live on the public site.
        $this->get('/tours')->assertInertia(fn (Assert $page) => $page
            ->has('tours', 1)
            ->where('tours.0.slug', 'pyramids-day-trip')
        );
    }

    public function test_admin_tour_creation_validates_required_titles(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post('/admin/tours', $this->validTourPayload(['title_ar' => '', 'title_en' => '']))
            ->assertSessionHasErrors(['title_ar', 'title_en']);

        $this->assertSame(0, Tour::count());
    }

    public function test_admin_tour_creation_rejects_duplicate_slug(): void
    {
        $admin = $this->admin();
        Tour::factory()->create(['slug' => 'taken-slug']);

        $this->actingAs($admin)
            ->post('/admin/tours', $this->validTourPayload(['slug' => 'taken-slug']))
            ->assertSessionHasErrors('slug');
    }

    public function test_admin_can_update_and_delete_a_tour(): void
    {
        $admin = $this->admin();
        $tour = Tour::factory()->create(['price' => 900]);

        $this->actingAs($admin)
            ->put("/admin/tours/{$tour->slug}", $this->validTourPayload([
                'destination_id' => $tour->destination_id,
                'slug' => $tour->slug,
                'price' => 2750,
            ]))
            ->assertRedirect(route('admin.tours.edit', $tour));

        $this->assertSame('2750.00', (string) $tour->fresh()->price);

        $this->actingAs($admin)
            ->delete("/admin/tours/{$tour->slug}")
            ->assertRedirect(route('admin.tours.index'));

        $this->assertSame(0, Tour::count());
    }

    public function test_admin_can_toggle_tour_active_flag(): void
    {
        $admin = $this->admin();
        $tour = Tour::factory()->create(['is_active' => true]);

        $this->actingAs($admin)
            ->patch("/admin/tours/{$tour->slug}/toggle", ['field' => 'is_active'])
            ->assertRedirect();

        $this->assertFalse($tour->fresh()->is_active);
    }

    public function test_non_admin_cannot_create_a_tour(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/admin/tours', $this->validTourPayload())
            ->assertForbidden();

        $this->assertSame(0, Tour::count());
    }

    // ——— Destinations management ———

    public function test_admin_can_edit_a_destination(): void
    {
        $admin = $this->admin();
        $destination = Destination::factory()->create(['name_en' => 'Old Name']);

        $this->actingAs($admin)
            ->put("/admin/destinations/{$destination->slug}", [
                'slug' => $destination->slug,
                'name_ar' => $destination->name_ar,
                'name_en' => 'New Shiny Name',
                'tagline_ar' => $destination->tagline_ar,
                'tagline_en' => 'A brand new tagline',
                'description_ar' => $destination->description_ar,
                'description_en' => $destination->description_en,
                'region' => $destination->region,
                'gradient' => $destination->gradient,
                'glyph' => $destination->glyph,
                'sort_order' => 3,
                'is_featured' => true,
            ])
            ->assertRedirect(route('admin.destinations.edit', $destination));

        $fresh = $destination->fresh();
        $this->assertSame('New Shiny Name', $fresh->name_en);
        $this->assertSame('A brand new tagline', $fresh->tagline_en);
        $this->assertTrue($fresh->is_featured);
        $this->assertSame(3, $fresh->sort_order);
    }

    // ——— Promote command ———

    public function test_promote_command_grants_admin_to_existing_user(): void
    {
        $user = User::factory()->create(['email' => 'owner@example.com']);
        $this->assertFalse($user->is_admin);

        $exitCode = Artisan::call('admin:promote', ['email' => 'owner@example.com']);

        $this->assertSame(0, $exitCode);
        $this->assertTrue($user->fresh()->is_admin);
        $this->assertStringContainsString('Promoted', Artisan::output());
    }

    public function test_promote_command_fails_for_unknown_email(): void
    {
        $exitCode = Artisan::call('admin:promote', ['email' => 'nobody@example.com']);

        $this->assertSame(1, $exitCode);
    }

    public function test_promoted_user_can_access_admin(): void
    {
        $user = User::factory()->create(['email' => 'boss@example.com']);
        Artisan::call('admin:promote', ['email' => 'boss@example.com']);

        $this->actingAs($user->fresh())->get('/admin')->assertOk();
    }
}
