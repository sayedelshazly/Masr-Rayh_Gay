<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssistantTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();
    }

    public function test_recommendations_respect_destination_budget_and_length(): void
    {
        $response = $this->postJson('/assistant/recommend', [
            'group' => 'giza',
            'budget' => 'under_2000',
            'length' => 'day',
        ])->assertOk();

        $response->assertJsonPath('relaxed', false);
        $slugs = collect($response->json('tours'))->pluck('slug');
        $this->assertTrue($slugs->contains('pyramids-egyptian-museum-day-tour'));
        foreach ($response->json('tours') as $tour) {
            $this->assertSame('القاهرة والجيزة', $tour['destination_ar']);
            $this->assertLessThanOrEqual(2000, $tour['price']);
            $this->assertSame(1, $tour['duration_days']);
        }
    }

    public function test_impossible_combination_relaxes_and_still_suggests(): void
    {
        // No one-day Aswan trip costs over EGP 10,000 — the ladder must relax the budget.
        $response = $this->postJson('/assistant/recommend', [
            'group' => 'aswan',
            'budget' => 'over_10000',
            'length' => 'day',
        ])->assertOk();

        $response->assertJsonPath('relaxed', true);
        $this->assertNotEmpty($response->json('tours'));
        $this->assertLessThanOrEqual(3, count($response->json('tours')));
    }

    public function test_anything_goes_returns_top_rated_suggestions(): void
    {
        $response = $this->postJson('/assistant/recommend', [
            'group' => 'any',
            'budget' => 'any',
            'length' => 'any',
        ])->assertOk();

        $response->assertJsonPath('relaxed', false);
        $this->assertCount(3, $response->json('tours'));
    }

    public function test_invalid_answers_are_rejected(): void
    {
        $this->postJson('/assistant/recommend', ['group' => 'mars'])->assertUnprocessable();
        $this->postJson('/assistant/recommend', ['budget' => 'free'])->assertUnprocessable();
    }
}
