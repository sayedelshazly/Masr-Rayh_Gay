<?php

namespace Tests\Feature;

use App\Models\Destination;
use App\Models\Tour;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DestinationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_destinations_index_returns_200_with_inertia_component(): void
    {
        Destination::factory()->count(3)->create();

        $response = $this->get('/destinations');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Destinations/Index')
            ->has('destinations', 3)
        );
    }

    public function test_destination_show_returns_200_with_its_tours(): void
    {
        $destination = Destination::factory()->create();
        Tour::factory()->count(2)->create(['destination_id' => $destination->id]);
        Tour::factory()->create(); // another destination's tour

        $response = $this->get("/destinations/{$destination->slug}");

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Destinations/Show')
            ->where('destination.id', $destination->id)
            ->has('tours', 2)
        );
    }

    public function test_home_page_receives_featured_content_from_database(): void
    {
        $destination = Destination::factory()->featured()->create();
        Tour::factory()->featured()->create(['destination_id' => $destination->id]);

        $response = $this->get('/');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('featuredDestinations', 1)
            ->has('featuredTours', 1)
            ->has('destinations', 1)
        );
    }
}
