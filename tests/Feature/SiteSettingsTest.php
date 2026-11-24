<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\SiteSetting;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SiteSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_headers_are_sent(): void
    {
        $response = $this->get('/')->assertOk();
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_login_is_throttled_after_ten_attempts(): void
    {
        User::factory()->create(['email' => 'victim@example.com']);

        for ($i = 0; $i < 10; $i++) {
            $this->post('/login', ['email' => 'victim@example.com', 'password' => 'wrong-password']);
        }

        $this->post('/login', ['email' => 'victim@example.com', 'password' => 'wrong-password'])
            ->assertStatus(429);
    }

    public function test_admin_can_update_settings_and_guests_cannot(): void
    {
        $this->get('/admin/settings')->assertRedirect('/login');
        $member = User::factory()->create(['is_admin' => false]);
        $this->actingAs($member)->get('/admin/settings')->assertForbidden();

        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin)->get('/admin/settings')->assertOk();
        $this->actingAs($admin)->put('/admin/settings', [
            'whatsapp_number' => '+20 100 000 1122',
            'contact_email' => 'hi@masr.example',
            'hold_minutes' => 30,
            'reviews_enabled' => true,
            'photos_enabled' => true,
            'film_enabled' => true,
            'plan_enabled' => true,
        ])->assertRedirect();

        $settings = SiteSetting::singleton();
        $this->assertSame('+20 100 000 1122', $settings->whatsapp_number);
        $this->assertSame(30, $settings->hold_minutes);
    }

    public function test_disabling_a_feature_blocks_its_endpoint(): void
    {
        Storage::fake('public');
        SiteSetting::singleton()->update([
            'reviews_enabled' => false,
            'photos_enabled' => false,
            'film_enabled' => false,
            'plan_enabled' => false,
        ]);

        $tour = Tour::factory()->create();
        $booking = Booking::factory()->create([
            'tour_id' => $tour->id,
            'status' => Booking::STATUS_CONFIRMED,
            'travel_date' => now()->subDays(2)->toDateString(),
        ]);

        $this->post("/booking/{$booking->reference}/review", ['rating' => 5, 'body' => 'Great'])->assertForbidden();
        $this->post("/booking/{$booking->reference}/photos", ['photo' => UploadedFile::fake()->image('a.jpg')])->assertForbidden();
        $this->post('/film-your-journey', [
            'package' => 'film', 'name' => 'A', 'phone' => '01001112233',
        ])->assertForbidden();
        $this->post('/plan-your-trip', [
            'name' => 'A', 'phone' => '01001112233', 'days' => 2, 'adults' => 2, 'children' => 0,
        ])->assertForbidden();
    }

    public function test_hold_minutes_setting_controls_expiry(): void
    {
        SiteSetting::singleton()->update(['hold_minutes' => 60]);

        $tour = Tour::factory()->create();
        $departure = $tour->departures()->create([
            'date' => now()->addDays(3)->toDateString(), 'time' => '08:00', 'capacity' => 10, 'is_active' => true,
        ]);
        $booking = Booking::factory()->create([
            'tour_id' => $tour->id,
            'departure_id' => $departure->id,
            'status' => Booking::STATUS_PENDING,
            'travel_date' => now()->addDays(3)->toDateString(),
        ]);
        $booking->forceFill(['created_at' => now()->subMinutes(30)])->save();

        Artisan::call('bookings:expire-holds');
        $this->assertSame(Booking::STATUS_PENDING, $booking->fresh()->status);
    }
}
