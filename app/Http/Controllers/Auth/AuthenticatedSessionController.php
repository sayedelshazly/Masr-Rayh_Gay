<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /** Show the login page. */
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /** Attempt to sign the user in. */
    public function store(Request $request): RedirectResponse
    {
        $this->applyLocale($request);

        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
        ]);

        if (! Auth::attempt(
            ['email' => $credentials['email'], 'password' => $credentials['password']],
            (bool) ($credentials['remember'] ?? false),
        )) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    /** Sign the user out. */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
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
