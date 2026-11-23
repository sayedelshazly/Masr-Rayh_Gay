<?php

namespace Tests\Feature;

use App\Models\TripRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TripRequestsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Sara Nabil',
            'email' => 'sara@example.com',
            'phone' => '0101 234 5678',
            'destinations' => ['luxor', 'aswan'],
            'start_date' => now()->addMonth()->format('Y-m-d'),
            'days' => 6,
            'adults' => 2,
            'children' => 1,
            'budget' => '7000_15000',
            'interests' => ['history', 'food'],
            'notes' => 'Honeymoon — a felucca at sunset would be lovely.',
            'locale' => 'en',
        ], $overrides);
    }

    public function test_the_design_your_trip_page_renders_with_destinations(): void
    {
        $this->get(route('plan-trip.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('PlanTrip')
                ->has('destinations', 8)
                ->where('submitted', false)
            );
    }

    public function test_a_valid_request_is_stored_and_confirmed(): void
    {
        $this->post(route('plan-trip.store'), $this->payload())
            ->assertRedirect(route('plan-trip.create'));

        $tripRequest = TripRequest::firstOrFail();
        $this->assertSame('new', $tripRequest->status);
        $this->assertSame(['luxor', 'aswan'], $tripRequest->destinations);
        $this->assertSame(['history', 'food'], $tripRequest->interests);
        $this->assertSame(6, $tripRequest->days);

        // The success state shows after the redirect.
        $this->get(route('plan-trip.create'))
            ->assertInertia(fn (Assert $page) => $page->where('submitted', true));
    }

    public function test_unknown_destinations_and_interests_are_rejected(): void
    {
        $this->post(route('plan-trip.store'), $this->payload(['destinations' => ['atlantis']]))
            ->assertSessionHasErrors('destinations.0');
        $this->post(route('plan-trip.store'), $this->payload(['interests' => ['skydiving']]))
            ->assertSessionHasErrors('interests.0');
        $this->post(route('plan-trip.store'), $this->payload(['destinations' => []]))
            ->assertSessionHasErrors('destinations');

        $this->assertSame(0, TripRequest::count());
    }

    public function test_admin_manages_requests_and_guests_cannot(): void
    {
        $tripRequest = TripRequest::create([
            'name' => 'Sara Nabil',
            'email' => 'sara@example.com',
            'phone' => '0101 234 5678',
            'destinations' => ['luxor'],
            'days' => 4,
            'adults' => 2,
            'children' => 0,
            'status' => TripRequest::STATUS_NEW,
        ]);

        $this->get(route('admin.trip-requests.index'))->assertRedirect(route('login'));

        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin)
            ->get(route('admin.trip-requests.index'))
            ->assertInertia(fn (Assert $page) => $page->has('requests', 1));

        $this->actingAs($admin)
            ->patch(route('admin.trip-requests.status', $tripRequest), ['status' => 'contacted'])
            ->assertRedirect();
        $this->assertSame('contacted', $tripRequest->fresh()->status);

        $this->actingAs($admin)
            ->delete(route('admin.trip-requests.destroy', $tripRequest))
            ->assertRedirect();
        $this->assertSame(0, TripRequest::count());
    }
}
