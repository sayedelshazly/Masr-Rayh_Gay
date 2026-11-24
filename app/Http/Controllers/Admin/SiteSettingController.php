<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Settings', [
            'settings' => SiteSetting::singleton()->only(
                'whatsapp_number', 'contact_email', 'hold_minutes',
                'reviews_enabled', 'photos_enabled', 'film_enabled', 'plan_enabled',
            ),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'whatsapp_number' => ['nullable', 'string', 'max:32', 'regex:/^[+0-9\s-]*$/'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'hold_minutes' => ['required', 'integer', 'min:5', 'max:120'],
            'reviews_enabled' => ['required', 'boolean'],
            'photos_enabled' => ['required', 'boolean'],
            'film_enabled' => ['required', 'boolean'],
            'plan_enabled' => ['required', 'boolean'],
        ]);

        SiteSetting::singleton()->update($validated);

        return back();
    }
}
