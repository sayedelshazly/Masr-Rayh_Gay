<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DestinationController extends Controller
{
    public function index(): Response
    {
        $destinations = Destination::ordered()
            ->withCount('tours')
            ->get();

        return Inertia::render('Admin/Destinations/Index', [
            'destinations' => $destinations,
        ]);
    }

    public function edit(Destination $destination): Response
    {
        return Inertia::render('Admin/Destinations/Edit', [
            'destination' => $destination,
        ]);
    }

    public function update(Request $request, Destination $destination): RedirectResponse
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'max:255', Rule::unique('destinations', 'slug')->ignore($destination)],
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'tagline_ar' => ['nullable', 'string', 'max:255'],
            'tagline_en' => ['nullable', 'string', 'max:255'],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'region' => ['required', 'string', 'max:255'],
            'gradient' => ['nullable', 'string', 'max:255'],
            'glyph' => ['nullable', 'string', 'max:16'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $destination->update([
            ...$validated,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_featured' => $request->boolean('is_featured'),
        ]);

        return redirect()->route('admin.destinations.edit', $destination)
            ->with('success', 'destination_updated');
    }
}
