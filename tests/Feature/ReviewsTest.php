<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ReviewsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    private function finishedBooking(array $overrides = []): Booking
    {
        $tour = Tour::where('slug', 'pyramids-egyptian-museum-day-tour')->firstOrFail();

        return Booking::create(array_merge([
            'tour_id' => $tour->id,
            'customer_name' => 'Happy Traveller',
            'customer_email' => 'happy@example.com',
            'customer_phone' => '0100 000 0000',
            'travel_date' => now()->subDays(3),
            'adults' => 2,
            'children' => 0,
            'total_price' => 3700,
            'status' => Booking::STATUS_CONFIRMED,
            'locale' => 'en',
        ], $overrides));
    }

    public function test_a_finished_confirmed_booking_can_be_reviewed_once(): void
    {
        $booking = $this->finishedBooking();

        $this->post(route('bookings.review', $booking), [
            'rating' => 5,
            'body' => 'The guide was phenomenal and the museum timing was perfect.',
        ])->assertRedirect();

        $review = Review::firstOrFail();
        $this->assertSame($booking->id, $review->booking_id);
        $this->assertFalse($review->is_approved);

        // A second review for the same booking is refused.
        $this->post(route('bookings.review', $booking), [
            'rating' => 1,
            'body' => 'Trying to review twice.',
        ])->assertSessionHasErrors('body');
        $this->assertSame(1, Review::count());
    }

    public function test_unfinished_or_unconfirmed_bookings_cannot_be_reviewed(): void
    {
        $future = $this->finishedBooking(['travel_date' => now()->addDays(4)]);
        $this->post(route('bookings.review', $future), ['rating' => 5, 'body' => 'Too soon.'])
            ->assertStatus(422);

        $pending = $this->finishedBooking(['status' => Booking::STATUS_PENDING]);
        $this->post(route('bookings.review', $pending), ['rating' => 5, 'body' => 'Not confirmed.'])
            ->assertStatus(422);

        $this->assertSame(0, Review::count());
    }

    public function test_only_approved_reviews_show_and_drive_the_tour_rating(): void
    {
        $booking = $this->finishedBooking();
        $tour = $booking->tour;

        $review = Review::create([
            'booking_id' => $booking->id,
            'tour_id' => $tour->id,
            'author_name' => 'Happy Traveller',
            'rating' => 4,
            'body' => 'Great day out at the pyramids.',
            'is_approved' => false,
        ]);

        // Unapproved: the tour page keeps its editorial rating and hides the review.
        $this->get(route('tours.show', $tour))
            ->assertInertia(fn (Assert $page) => $page
                ->has('reviews', 0)
                ->where('tour.rating', fn ($rating) => abs((float) $rating - (float) $tour->rating) < 0.001)
            );

        $review->update(['is_approved' => true]);

        // Approved: it appears, and the public rating becomes the real average.
        $this->get(route('tours.show', $tour))
            ->assertInertia(fn (Assert $page) => $page
                ->has('reviews', 1)
                ->where('reviews.0.rating', 4)
                ->where('tour.rating', fn ($rating) => abs((float) $rating - 4.0) < 0.001)
                ->where('tour.reviews_count', 1)
            );
    }

    public function test_admin_moderates_reviews_and_guests_cannot(): void
    {
        $booking = $this->finishedBooking();
        $review = Review::create([
            'booking_id' => $booking->id,
            'tour_id' => $booking->tour_id,
            'author_name' => 'Happy Traveller',
            'rating' => 5,
            'body' => 'Unforgettable.',
            'is_approved' => false,
        ]);

        $this->get(route('admin.reviews.index'))->assertRedirect(route('login'));

        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin)
            ->patch(route('admin.reviews.toggle', $review))
            ->assertRedirect();
        $this->assertTrue($review->fresh()->is_approved);

        $this->actingAs($admin)
            ->delete(route('admin.reviews.destroy', $review))
            ->assertRedirect();
        $this->assertSame(0, Review::count());
    }

    public function test_my_bookings_flags_reviewable_trips(): void
    {
        $user = User::factory()->create();
        $booking = $this->finishedBooking(['user_id' => $user->id, 'customer_email' => $user->email]);

        $this->actingAs($user)
            ->get(route('bookings.mine'))
            ->assertInertia(fn (Assert $page) => $page
                ->where('bookings.0.id', $booking->id)
                ->where('bookings.0.can_review', true)
                ->where('bookings.0.has_review', false)
            );
    }
}
