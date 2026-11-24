<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Review;
use App\Models\Tour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SeoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
        Cache::forget('seo.sitemap');
    }

    public function test_sitemap_lists_public_pages_tours_destinations_and_lessons(): void
    {
        $response = $this->get('/sitemap.xml')->assertOk();
        $response->assertHeader('Content-Type', 'application/xml');

        $xml = $response->getContent();
        $this->assertStringContainsString('/tours/pyramids-egyptian-museum-day-tour', $xml);
        $this->assertStringContainsString('/destinations/cairo-giza', $xml);
        $this->assertStringContainsString('/academy/lessons/', $xml);
        $this->assertStringContainsString('/plan-your-trip', $xml);
        $this->assertStringNotContainsString('/admin', $xml);
        $this->assertSame(34, substr_count($xml, '<loc>'));
    }

    public function test_robots_disallows_private_areas_and_points_to_the_sitemap(): void
    {
        $response = $this->get('/robots.txt')->assertOk();
        $text = $response->getContent();
        $this->assertStringContainsString('Disallow: /admin', $text);
        $this->assertStringContainsString('Disallow: /booking/', $text);
        $this->assertStringContainsString('Sitemap: ', $text);
        $this->assertStringContainsString('/sitemap.xml', $text);
    }

    public function test_home_html_carries_the_agency_schema_and_meta_description(): void
    {
        $html = $this->get('/')->assertOk()->getContent();
        $this->assertStringContainsString('application/ld+json', $html);
        $this->assertStringContainsString('TravelAgency', $html);
        $this->assertStringContainsString('name="description"', $html);
        $this->assertStringContainsString('og:image', $html);
    }

    public function test_tour_schema_has_the_offer_and_only_real_ratings(): void
    {
        $tour = Tour::where('slug', 'pyramids-egyptian-museum-day-tour')->firstOrFail();

        $html = $this->get(route('tours.show', $tour))->assertOk()->getContent();
        $this->assertStringContainsString('TouristTrip', $html);
        $this->assertStringContainsString('"priceCurrency":"EGP"', $html);
        // No approved reviews yet: the rating must NOT be advertised.
        $this->assertStringNotContainsString('aggregateRating', $html);

        $booking = Booking::create([
            'tour_id' => $tour->id,
            'customer_name' => 'Real Reviewer',
            'customer_email' => 'real@example.com',
            'customer_phone' => '0100 000 0000',
            'travel_date' => now()->subDays(2),
            'adults' => 1,
            'children' => 0,
            'total_price' => 1850,
            'status' => Booking::STATUS_CONFIRMED,
        ]);
        Review::create([
            'booking_id' => $booking->id,
            'tour_id' => $tour->id,
            'author_name' => 'Real Reviewer',
            'rating' => 5,
            'body' => 'Perfect day.',
            'is_approved' => true,
        ]);

        $html = $this->get(route('tours.show', $tour))->getContent();
        $this->assertStringContainsString('aggregateRating', $html);
        $this->assertStringContainsString('"reviewCount":1', $html);
    }

    public function test_destination_schema_is_present(): void
    {
        $html = $this->get('/destinations/cairo-giza')->assertOk()->getContent();
        $this->assertStringContainsString('TouristDestination', $html);
        $this->assertStringContainsString('BreadcrumbList', $html);
    }
}
