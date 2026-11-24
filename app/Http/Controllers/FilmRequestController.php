<?php

namespace App\Http\Controllers;

use App\Models\FilmRequest;
use App\Models\Tour;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FilmRequestController extends Controller
{
    public function create(Request $request): Response
    {
        $selectedTour = $request->query('tour');
        $tours = Tour::active()->orderBy('title_ar')->get(['id', 'slug', 'title_ar', 'title_en']);

        return Inertia::render('FilmYourJourney', [
            'packages' => collect(array_keys(FilmRequest::PACKAGES))
                ->map(fn (string $key) => ['key' => $key, 'price' => FilmRequest::PACKAGES[$key]])
                ->all(),
            'tours' => $tours,
            'initial' => [
                'tour_id' => $tours->firstWhere('slug', $selectedTour)?->id,
                'name' => $request->user()?->name ?? '',
                'email' => $request->user()?->email ?? '',
            ],
            'submitted' => $request->session()->has('film_request_submitted'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'package' => ['required', 'string', 'in:'.implode(',', array_keys(FilmRequest::PACKAGES))],
            'tour_id' => ['nullable', 'integer', 'exists:tours,id'],
            'travel_date' => ['nullable', 'date', 'after_or_equal:today'],
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:160'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        FilmRequest::create([...$validated, 'status' => FilmRequest::STATUS_NEW]);

        return back()->with('film_request_submitted', true);
    }
}
