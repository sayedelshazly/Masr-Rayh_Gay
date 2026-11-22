<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /** Checkout page: tour summary + the full guest booking form. */
    public function create(Request $request, Tour $tour): Response
    {
        abort_unless($tour->is_active, 404);

        $tour->load('destination');

        return Inertia::render('Bookings/Create', [
            'tour' => $tour,
            'initial' => [
                'travel_date' => $this->initialDate($request->query('travel_date')),
                'adults' => $this->initialGuests($request->query('adults'), 2),
                'children' => $this->initialGuests($request->query('children'), 0),
            ],
        ]);
    }

    /** Store a guest booking. Total is always computed server-side. */
    public function store(Request $request, Tour $tour): RedirectResponse
    {
        abort_unless($tour->is_active, 404);

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'min:7', 'max:20'],
            'travel_date' => ['required', 'date', 'after_or_equal:today'],
            'adults' => ['required', 'integer', 'min:1', 'max:30'],
            'children' => ['nullable', 'integer', 'min:0', 'max:30'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
        ]);

        $adults = (int) $validated['adults'];
        $children = (int) ($validated['children'] ?? 0);

        $booking = Booking::create([
            'tour_id' => $tour->id,
            'user_id' => $request->user()?->id,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'travel_date' => $validated['travel_date'],
            'adults' => $adults,
            'children' => $children,
            'total_price' => Booking::calculateTotal($tour, $adults, $children),
            'status' => Booking::STATUS_PENDING,
            'notes' => $validated['notes'] ?? null,
            'locale' => $validated['locale'] ?? 'ar',
        ]);

        return redirect()->route('bookings.show', $booking);
    }

    /** Confirmation page, addressed by the public booking reference. */
    public function show(Booking $booking): Response
    {
        $booking->load(['tour.destination']);

        return Inertia::render('Bookings/Show', [
            'booking' => $booking,
        ]);
    }

    /** Accept a YYYY-MM-DD query value only when it is a real, non-past date. */
    private function initialDate(mixed $value): string
    {
        if (is_string($value) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            $date = \DateTimeImmutable::createFromFormat('Y-m-d', $value);

            if ($date && $date->format('Y-m-d') >= now()->format('Y-m-d')) {
                return $value;
            }
        }

        return '';
    }

    /** Clamp a guest-count query value into the allowed 0..30 range. */
    private function initialGuests(mixed $value, int $default): int
    {
        if (is_numeric($value)) {
            return max(0, min(30, (int) $value));
        }

        return $default;
    }
}
