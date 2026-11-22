<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_returns_200_for_guests(): void
    {
        $response = $this->get('/login');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Auth/Login')
            ->where('auth.user', null)
        );
    }

    public function test_register_page_returns_200_for_guests(): void
    {
        $response = $this->get('/register');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Auth/Register')
            ->where('auth.user', null)
        );
    }

    public function test_user_can_register_and_is_logged_in_immediately(): void
    {
        $response = $this->post('/register', [
            'name' => 'Sayed Elshazly',
            'email' => 'sayed@example.com',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
        ]);

        $response->assertRedirect('/');

        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'name' => 'Sayed Elshazly',
            'email' => 'sayed@example.com',
            'is_admin' => false,
        ]);
        $this->assertSame('sayed@example.com', auth()->user()->email);
    }

    public function test_register_rejects_unconfirmed_password_and_duplicate_email(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $this->post('/register', [
            'name' => 'Someone',
            'email' => 'taken@example.com',
            'password' => 'secret-password',
            'password_confirmation' => 'different-password',
        ])->assertSessionHasErrors(['email', 'password']);

        $this->assertGuest();
        $this->assertDatabaseCount('users', 1);
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create(['email' => 'traveler@example.com']);

        // The factory hashes the well-known password "password".
        $response = $this->post('/login', [
            'email' => 'traveler@example.com',
            'password' => 'password',
        ]);

        $response->assertRedirect('/');
        $this->assertAuthenticatedAs($user);
    }

    public function test_login_with_wrong_password_fails_with_error_and_stays_guest(): void
    {
        User::factory()->create(['email' => 'traveler@example.com']);

        $response = $this->from('/login')->post('/login', [
            'email' => 'traveler@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertRedirect('/login');
        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_login_redirects_back_to_the_intended_page(): void
    {
        $user = User::factory()->create();

        // Visiting a protected page as a guest stores it as intended.
        $this->get('/my-bookings')->assertRedirect('/login');

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect('/my-bookings');

        $this->assertAuthenticatedAs($user);
    }

    public function test_authenticated_users_are_redirected_away_from_login_and_register(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/login')->assertRedirect('/');
        $this->actingAs($user)->get('/register')->assertRedirect('/');
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/logout')->assertRedirect('/');

        $this->assertGuest();
    }

    public function test_guests_cannot_logout(): void
    {
        $this->post('/logout')->assertRedirect('/login');
    }

    public function test_authenticated_user_is_shared_with_inertia_pages(): void
    {
        $user = User::factory()->create([
            'name' => 'Shared User',
            'email' => 'shared@example.com',
        ]);

        $response = $this->actingAs($user)->get('/');

        $response->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.id', $user->id)
            ->where('auth.user.name', 'Shared User')
            ->where('auth.user.email', 'shared@example.com')
            ->where('auth.user.is_admin', false)
        );
    }

    public function test_admin_factory_state_sets_is_admin(): void
    {
        $admin = User::factory()->admin()->create();

        $this->assertTrue($admin->is_admin);
        $this->assertDatabaseHas('users', ['id' => $admin->id, 'is_admin' => true]);
    }
}
