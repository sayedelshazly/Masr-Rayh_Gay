<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /** Show the registration page. */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /** Register a new account and sign the user in immediately. */
    public function store(Request $request): RedirectResponse
    {
        $this->applyLocale($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::min(8), 'confirmed'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        event(new Registered($user));

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    /** Honour the UI locale so validation/auth messages come back translated. */
    private function applyLocale(Request $request): void
    {
        $locale = $request->input('locale');

        if (in_array($locale, ['ar', 'en'], true)) {
            app()->setLocale($locale);
        }
    }
}
