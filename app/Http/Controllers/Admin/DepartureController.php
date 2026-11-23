<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tour;
use App\Models\TourDeparture;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DepartureController extends Controller
{
    /** Add a scheduled departure (date, optional time, seats, optional price). */
    public function store(Request $request, Tour $tour): RedirectResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time' => ['nullable', 'date_format:H:i'],
            'capacity' => ['required', 'integer', 'min:1', 'max:500'],
            'price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $tour->departures()->create($validated);

        return redirect()->route('admin.tours.edit', $tour)->with('success', 'departure_created');
    }

    /** Show or hide a departure from the public booking flow. */
    public function toggle(Tour $tour, TourDeparture $departure): RedirectResponse
    {
        abort_unless($departure->tour_id === $tour->id, 404);

        $departure->update(['is_active' => ! $departure->is_active]);

        return redirect()->route('admin.tours.edit', $tour)->with('success', 'departure_updated');
    }

    /** Delete a departure. Its bookings keep their travel date. */
    public function destroy(Tour $tour, TourDeparture $departure): RedirectResponse
    {
        abort_unless($departure->tour_id === $tour->id, 404);

        $departure->delete();

        return redirect()->route('admin.tours.edit', $tour)->with('success', 'departure_deleted');
    }
}
