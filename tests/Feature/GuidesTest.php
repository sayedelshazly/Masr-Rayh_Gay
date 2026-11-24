<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GuidesTest extends TestCase
{
    use RefreshDatabase;

    public function test_guides_page_renders_the_team_with_totals(): void
    {
        $this->get('/guides')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Guides/Index')
                ->has('guides', 4)
                ->where('guides.0.name_ar', 'أحمد الشاذلي')
                ->where('totals.guides', 4)
                ->where('totals.trips', 1410)
                ->where('totals.languages', 6)
            );
    }

    public function test_every_guide_has_a_photo_that_exists_on_disk(): void
    {
        foreach (\App\Support\Guides::all() as $guide) {
            $this->assertFileExists(public_path(ltrim($guide['image'], '/')), $guide['slug']);
        }
    }
}
