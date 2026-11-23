<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CollectionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_collections_index_lists_the_three_packages_with_counts(): void
    {
        $this->get(route('collections.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Collections/Index')
                ->has('collections', 3)
                ->where('collections.0.slug', 'honeymoon')
                ->where('collections.0.tours_count', 4)
                ->where('collections.1.slug', 'family')
                ->where('collections.2.slug', 'adventure')
                ->where('collections.2.tours_count', 5)
            );
    }

    public function test_a_collection_page_shows_its_curated_tours_in_order(): void
    {
        $this->get(route('collections.show', 'honeymoon'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Collections/Show')
                ->has('tours', 4)
                ->where('tours.0.slug', 'nile-cruise-luxor-aswan-4-days')
                ->has('others', 2)
            );
    }

    public function test_an_unknown_collection_is_a_designed_404(): void
    {
        $this->get('/collections/atlantis')->assertNotFound();
    }

    public function test_home_carries_the_collections(): void
    {
        $this->get(route('home'))
            ->assertInertia(fn (Assert $page) => $page->has('collections', 3));
    }
}
