<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\TripRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TripRequestController extends Controller
{
    /** Inbox of tailor-made trip requests, newest first. */
    public function index(): Response
    {
        $names = Destination::pluck('name_ar', 'slug');

        $requests = TripRequest::latest()
            ->get()
            ->map(fn (TripRequest $tripRequest) => [
                'id' => $tripRequest->id,
                'name' => $tripRequest->name,
                'email' => $tripRequest->email,
                'phone' => $tripRequest->phone,
                'destinations' => collect($tripRequest->destinations)
                    ->map(fn ($slug) => $names[$slug] ?? $slug)
                    ->values(),
                'start_date' => $tripRequest->start_date?->format('Y-m-d'),
                'days' => $tripRequest->days,
                'adults' => $tripRequest->adults,
                'children' => $tripRequest->children,
                'budget' => $tripRequest->budget,
                'interests' => $tripRequest->interests ?? [],
                'notes' => $tripRequest->notes,
                'status' => $tripRequest->status,
                'created_at' => $tripRequest->created_at->format('Y-m-d'),
            ]);

        return Inertia::render('Admin/TripRequests/Index', [
            'requests' => $requests,
        ]);
    }

    /** Move a request along: new → contacted → closed. */
    public function updateStatus(Request $request, TripRequest $tripRequest): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(TripRequest::STATUSES)],
        ]);

        $tripRequest->update(['status' => $validated['status']]);

        return back()->with('success', 'trip_request_updated');
    }

    public function destroy(TripRequest $tripRequest): RedirectResponse
    {
        $tripRequest->delete();

        return back()->with('success', 'trip_request_deleted');
    }
}
