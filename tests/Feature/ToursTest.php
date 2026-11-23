<?php

namespace Tests\Feature;

use App\Models\Destination;
use App\Models\Tour;
use App\Models\TourItineraryDay;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ToursTest extends TestCase
{
    use RefreshDatabase;

    public function test_tours_index_returns_200_with_inertia_component_and_only_active_tours(): void
    {
        $destination = Destination::factory()->create(['slug' => 'luxor']);
        Tour::factory()->count(3)->create(['destination_id' => $destination->id]);
        Tour::factory()->inactive()->create(['destination_id' => $destination->id]);

        $response = $this->get('/tours');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Tours/Index')
            ->has('tours', 3)
            ->has('destinations')
            ->has('filters')
        );
    }

    public function test_tours_index_filters_by_destination_and_search(): void
    {
        $luxor = Destination::factory()->create(['slug' => 'luxor']);
        $aswan = Destination::factory()->create(['slug' => 'aswan']);

        Tour::factory()->create([
            'destination_id' => $luxor->id,
            'title_en' => 'Luxor Temples Tour',
        ]);
        Tour::factory()->create(['destination_id' => $aswan->id]);

        $this->get('/tours?destination=luxor')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tours/Index')
                ->has('tours', 1)
                ->where('filters.destination', 'luxor')
            );

        $this->get('/tours?search=Temples')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Tours/Index')
                ->has('tours', 1)
            );
    }

    public function test_tour_show_returns_200_with_itinerary_and_related_tours(): void
    {
        $destination = Destination::factory()->create();
        $tour = Tour::factory()->create(['destination_id' => $destination->id]);
        TourItineraryDay::factory()->create(['tour_id' => $tour->id, 'day_number' => 1]);
        TourItineraryDay::factory()->create(['tour_id' => $tour->id, 'day_number' => 2]);
        Tour::factory()->create(['destination_id' => $destination->id]);

        $response = $this->get("/tours/{$tour->slug}");

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Tours/Show')
            ->where('tour.id', $tour->id)
            ->has('tour.itinerary_days', 2)
            ->has('tour.destination')
            ->has('relatedTours', 1)
        );
    }

    public function test_inactive_tour_show_returns_404(): void
    {
        $tour = Tour::factory()->inactive()->create();

        $this->get("/tours/{$tour->slug}")->assertNotFound();
    }
}
