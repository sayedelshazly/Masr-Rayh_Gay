<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\GalleryPhoto;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GalleryTest extends TestCase
{
    use RefreshDatabase;

    private function finishedBooking(): Booking
    {
        $tour = Tour::factory()->create();

        return Booking::factory()->create([
            'tour_id' => $tour->id,
            'status' => Booking::STATUS_CONFIRMED,
            'travel_date' => now()->subDays(3)->toDateString(),
        ]);
    }

    public function test_traveller_can_share_a_photo_and_it_waits_for_moderation(): void
    {
        Storage::fake('public');
        $booking = $this->finishedBooking();

        $this->post("/booking/{$booking->reference}/photos", [
            'photo' => UploadedFile::fake()->image('nile.jpg', 800, 600),
            'caption' => 'غروب النيل',
        ])->assertRedirect();

        $photo = GalleryPhoto::first();
        $this->assertNotNull($photo);
        $this->assertFalse($photo->is_approved);
        $this->assertSame('غروب النيل', $photo->caption);
        Storage::disk('public')->assertExists($photo->image);
    }

    public function test_unfinished_or_unconfirmed_bookings_cannot_share(): void
    {
        Storage::fake('public');
        $tour = Tour::factory()->create();
        $future = Booking::factory()->create([
            'tour_id' => $tour->id,
            'status' => Booking::STATUS_CONFIRMED,
            'travel_date' => now()->addDays(5)->toDateString(),
        ]);

        $this->post("/booking/{$future->reference}/photos", [
            'photo' => UploadedFile::fake()->image('x.jpg'),
        ])->assertStatus(422);

        $this->assertSame(0, GalleryPhoto::count());
    }

    public function test_non_image_uploads_are_rejected(): void
    {
        Storage::fake('public');
        $booking = $this->finishedBooking();

        $this->post("/booking/{$booking->reference}/photos", [
            'photo' => UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf'),
        ])->assertSessionHasErrors('photo');
    }

    public function test_public_gallery_shows_only_approved_photos(): void
    {
        Storage::fake('public');
        $booking = $this->finishedBooking();
        GalleryPhoto::create(['booking_id' => $booking->id, 'image' => 'gallery/a.jpg', 'caption' => 'منشورة', 'is_approved' => true]);
        GalleryPhoto::create(['booking_id' => $booking->id, 'image' => 'gallery/b.jpg', 'caption' => 'مستخبية', 'is_approved' => false]);

        $response = $this->get('/gallery')->assertOk();
        $photos = $response->viewData('page')['props']['photos'];
        $this->assertCount(1, $photos);
        $this->assertSame('منشورة', $photos[0]['caption']);
    }

    public function test_admin_can_publish_and_delete_photos(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('gallery/a.jpg', 'x');
        $admin = User::factory()->create(['is_admin' => true]);
        $booking = $this->finishedBooking();
        $photo = GalleryPhoto::create(['booking_id' => $booking->id, 'image' => 'gallery/a.jpg', 'is_approved' => false]);

        $this->actingAs($admin)->patch("/admin/gallery/{$photo->id}/toggle")->assertRedirect();
        $this->assertTrue($photo->fresh()->is_approved);

        $this->actingAs($admin)->delete("/admin/gallery/{$photo->id}")->assertRedirect();
        $this->assertSame(0, GalleryPhoto::count());
        Storage::disk('public')->assertMissing('gallery/a.jpg');
    }

    public function test_gallery_admin_is_admin_only(): void
    {
        $this->get('/admin/gallery')->assertRedirect('/login');
        $member = User::factory()->create(['is_admin' => false]);
        $this->actingAs($member)->get('/admin/gallery')->assertForbidden();
    }
}
