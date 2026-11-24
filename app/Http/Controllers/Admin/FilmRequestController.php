<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FilmRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FilmRequestController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/FilmRequests/Index', [
            'requests' => FilmRequest::with('tour:id,slug,title_ar,title_en')
                ->latest()
                ->get()
                ->map(fn (FilmRequest $filmRequest) => [
                    'id' => $filmRequest->id,
                    'package' => $filmRequest->package,
                    'price' => FilmRequest::PACKAGES[$filmRequest->package] ?? null,
                    'tour_title_ar' => $filmRequest->tour?->title_ar,
                    'tour_title_en' => $filmRequest->tour?->title_en,
                    'travel_date' => $filmRequest->travel_date?->format('Y-m-d'),
                    'name' => $filmRequest->name,
                    'phone' => $filmRequest->phone,
                    'email' => $filmRequest->email,
                    'notes' => $filmRequest->notes,
                    'status' => $filmRequest->status,
                    'created_at' => $filmRequest->created_at->format('Y-m-d H:i'),
                ]),
        ]);
    }

    public function update(Request $request, FilmRequest $filmRequest): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:'.implode(',', FilmRequest::STATUSES)],
        ]);

        $filmRequest->update($validated);

        return back()->with('success', 'film_request_updated');
    }

    public function destroy(FilmRequest $filmRequest): RedirectResponse
    {
        $filmRequest->delete();

        return back()->with('success', 'film_request_deleted');
    }
}
