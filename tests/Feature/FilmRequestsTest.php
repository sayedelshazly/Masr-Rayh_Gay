<?php

namespace Tests\Feature;

use App\Models\FilmRequest;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class FilmRequestsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_film_page_renders_with_packages(): void
    {
        $this->get('/film-your-journey')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('FilmYourJourney')
                ->has('packages', 3)
                ->where('packages.1.key', 'film')
                ->where('packages.1.price', 9500)
                ->has('tours', 12)
            );
    }

    public function test_a_guest_can_request_a_film(): void
    {
        $tour = Tour::where('slug', 'pyramids-egyptian-museum-day-tour')->firstOrFail();

        $this->post('/film-your-journey', [
            'package' => 'royal',
            'tour_id' => $tour->id,
            'travel_date' => now()->addDays(10)->toDateString(),
            'name' => 'Ahmed Samy',
            'phone' => '0100 111 2233',
            'email' => 'ahmed@example.com',
            'notes' => 'A proposal at the Pyramids!',
        ])->assertRedirect()->assertSessionHas('film_request_submitted');

        $this->assertDatabaseHas('film_requests', [
            'package' => 'royal',
            'tour_id' => $tour->id,
            'name' => 'Ahmed Samy',
            'status' => 'new',
        ]);
    }

    public function test_invalid_package_and_missing_contact_are_rejected(): void
    {
        $this->post('/film-your-journey', ['package' => 'hollywood', 'name' => 'X', 'phone' => '1'])
            ->assertSessionHasErrors('package');
        $this->post('/film-your-journey', ['package' => 'film'])
            ->assertSessionHasErrors(['name', 'phone']);
        $this->assertDatabaseCount('film_requests', 0);
    }

    public function test_admin_inbox_lists_requests_and_flows_status(): void
    {
        $filmRequest = FilmRequest::create([
            'package' => 'film',
            'name' => 'Sara',
            'phone' => '0100',
            'status' => 'new',
        ]);
        $admin = User::factory()->create(['is_admin' => true]);
        $guest = User::factory()->create();

        $this->actingAs($guest)->get('/admin/film-requests')->assertForbidden();

        $this->actingAs($admin)
            ->get('/admin/film-requests')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/FilmRequests/Index')
                ->has('requests', 1)
                ->where('requests.0.name', 'Sara')
            );

        $this->actingAs($admin)
            ->patch("/admin/film-requests/{$filmRequest->id}", ['status' => 'contacted'])
            ->assertRedirect();
        $this->assertSame('contacted', $filmRequest->fresh()->status);

        $this->actingAs($admin)->delete("/admin/film-requests/{$filmRequest->id}")->assertRedirect();
        $this->assertDatabaseCount('film_requests', 0);
    }
}
