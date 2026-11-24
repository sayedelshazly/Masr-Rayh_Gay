<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\TripRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TripRequestController extends Controller
{
    /** The "Design your trip" form, fed with the real destinations. */
    public function create(Request $request): Response
    {
        return Inertia::render('PlanTrip', [
            'destinations' => Destination::ordered()->get(['id', 'slug', 'name_ar', 'name_en', 'image']),
            'submitted' => $request->session()->get('trip_request_submitted', false),
            'prefill' => $request->user() ? [
                'name' => $request->user()->name,
                'email' => $request->user()->email,
            ] : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if(! \App\Models\SiteSetting::singleton()->plan_enabled, 403);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:160'],
            'phone' => ['required', 'string', 'max:40'],
            'destinations' => ['required', 'array', 'min:1'],
            'destinations.*' => ['string', Rule::exists('destinations', 'slug')],
            'start_date' => ['nullable', 'date', 'after_or_equal:today'],
            'days' => ['required', 'integer', 'min:1', 'max:60'],
            'adults' => ['required', 'integer', 'min:1', 'max:50'],
            'children' => ['required', 'integer', 'min:0', 'max:50'],
            'budget' => ['nullable', Rule::in(TripRequest::BUDGETS)],
            'interests' => ['nullable', 'array'],
            'interests.*' => ['string', Rule::in(TripRequest::INTERESTS)],
            'notes' => ['nullable', 'string', 'max:2000'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
        ]);

        TripRequest::create([
            ...$validated,
            'user_id' => $request->user()?->id,
            'status' => TripRequest::STATUS_NEW,
            'locale' => $validated['locale'] ?? 'ar',
        ]);

        return redirect()->route('plan-trip.create')
            ->with('trip_request_submitted', true);
    }
}
