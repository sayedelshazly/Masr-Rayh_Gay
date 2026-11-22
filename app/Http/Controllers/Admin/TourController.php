<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Tour;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TourController extends Controller
{
    public function index(): Response
    {
        $tours = Tour::with('destination:id,slug,name_ar,name_en')
            ->orderByDesc('is_featured')
            ->orderBy('title_en')
            ->get();

        return Inertia::render('Admin/Tours/Index', [
            'tours' => $tours,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Tours/Create', [
            'destinations' => Destination::ordered()->get(['id', 'slug', 'name_ar', 'name_en']),
            'types' => Tour::TYPES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $tour = Tour::create($this->validatedData($request));

        return redirect()->route('admin.tours.edit', $tour)
            ->with('success', 'tour_created');
    }

    public function edit(Tour $tour): Response
    {
        return Inertia::render('Admin/Tours/Edit', [
            'tour' => $tour,
            'destinations' => Destination::ordered()->get(['id', 'slug', 'name_ar', 'name_en']),
            'types' => Tour::TYPES,
        ]);
    }

    public function update(Request $request, Tour $tour): RedirectResponse
    {
        $tour->update($this->validatedData($request, $tour));

        return redirect()->route('admin.tours.edit', $tour)
            ->with('success', 'tour_updated');
    }

    public function destroy(Tour $tour): RedirectResponse
    {
        $tour->delete();

        return redirect()->route('admin.tours.index');
    }

    /** Quick toggle for is_active / is_featured from the list. */
    public function toggle(Request $request, Tour $tour): RedirectResponse
    {
        $validated = $request->validate([
            'field' => ['required', Rule::in(['is_active', 'is_featured'])],
        ]);

        $tour->update([$validated['field'] => ! $tour->{$validated['field']}]);

        return back();
    }

    /**
     * Shared create/update payload. Includes arrive as one-per-line text
     * (textarea) or an array; both are normalized to a clean string array.
     */
    private function validatedData(Request $request, ?Tour $tour = null): array
    {
        $validated = $request->validate([
            'destination_id' => ['required', 'integer', Rule::exists('destinations', 'id')],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('tours', 'slug')->ignore($tour)],
            'image' => ['nullable', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'summary_ar' => ['nullable', 'string'],
            'summary_en' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'duration_nights' => ['nullable', 'integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'old_price' => ['nullable', 'numeric', 'min:0'],
            'type' => ['required', Rule::in(Tour::TYPES)],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'reviews_count' => ['nullable', 'integer', 'min:0'],
            'includes_ar' => ['nullable'],
            'includes_en' => ['nullable'],
            'meeting_point_ar' => ['nullable', 'string', 'max:255'],
            'meeting_point_en' => ['nullable', 'string', 'max:255'],
        ]);

        $slug = filled($validated['slug'] ?? null)
            ? Str::slug($validated['slug'])
            : Str::slug($validated['title_en']);

        // Auto-generated slugs must not collide; a hand-typed one is already
        // covered by the unique validation rule above.
        if (! $tour || $slug !== $tour->slug) {
            $base = $slug;
            $counter = 2;
            while (Tour::where('slug', $slug)->when($tour, fn ($q) => $q->whereKeyNot($tour->id))->exists()) {
                $slug = $base.'-'.$counter++;
            }
        }

        return [
            ...$validated,
            'slug' => $slug,
            'currency' => 'EGP',
            'reviews_count' => $validated['reviews_count'] ?? 0,
            'includes_ar' => $this->linesToArray($request->input('includes_ar')),
            'includes_en' => $this->linesToArray($request->input('includes_en')),
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => $request->boolean('is_active'),
        ];
    }

    private function linesToArray(mixed $value): array
    {
        if (is_array($value)) {
            return array_values(array_filter(array_map(fn ($line) => trim((string) $line), $value)));
        }

        if (! is_string($value) || trim($value) === '') {
            return [];
        }

        return array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $value))));
    }
}
