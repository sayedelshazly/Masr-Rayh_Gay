<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Tour;
use App\Models\TourDeparture;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /** Checkout page: tour summary + the full guest booking form. */
    public function create(Request $request, Tour $tour): Response
    {
        abort_unless($tour->is_active, 404);

        $tour->load('destination');

        $departures = $tour->departures()->upcoming()->get()
            ->map(fn (TourDeparture $departure) => $departure->toPublicArray());

        return Inertia::render('Bookings/Create', [
            'tour' => $tour,
            'departures' => $departures,
            'initial' => [
                'travel_date' => $this->initialDate($request->query('travel_date')),
                'departure_id' => $this->initialDeparture($request->query('departure_id'), $departures->pluck('id')->all()),
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
            'travel_date' => ['required_without:departure_id', 'nullable', 'date', 'after_or_equal:today'],
            'departure_id' => ['nullable', 'integer'],
            'adults' => ['required', 'integer', 'min:1', 'max:30'],
            'children' => ['nullable', 'integer', 'min:0', 'max:30'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'locale' => ['nullable', 'string', 'in:ar,en'],
        ]);

        $adults = (int) $validated['adults'];
        $children = (int) ($validated['children'] ?? 0);
        $locale = $validated['locale'] ?? 'ar';

        $attributes = [
            'tour_id' => $tour->id,
            'user_id' => $request->user()?->id,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'adults' => $adults,
            'children' => $children,
            'status' => Booking::STATUS_PENDING,
            'notes' => $validated['notes'] ?? null,
            'locale' => $locale,
        ];

        if (! empty($validated['departure_id'])) {
            $booking = $this->storeWithDeparture($tour, (int) $validated['departure_id'], $attributes, $locale);
        } else {
            $booking = Booking::create([
                ...$attributes,
                'travel_date' => $validated['travel_date'],
                'total_price' => Booking::calculateTotal($tour, $adults, $children),
            ]);
        }

        return redirect()->route('bookings.show', $booking);
    }

    /**
     * Book against a scheduled departure, guarding the seat count
     * inside a transaction: the departure row is locked while the
     * remaining seats are checked, so two guests racing for the
     * last seats can never both win (per the system design spec).
     */
    private function storeWithDeparture(Tour $tour, int $departureId, array $attributes, string $locale): Booking
    {
        return DB::transaction(function () use ($tour, $departureId, $attributes, $locale) {
            $departure = TourDeparture::where('tour_id', $tour->id)
                ->whereKey($departureId)
                ->lockForUpdate()
                ->first();

            $party = $attributes['adults'] + $attributes['children'];

            if ($departure === null || ! $departure->is_active || $departure->date->lt(now()->startOfDay())) {
                throw ValidationException::withMessages([
                    'departure_id' => $locale === 'en'
                        ? 'This departure is no longer available — please pick another date.'
                        : 'الموعد ده مبقاش متاح — اختر موعد تاني من فضلك.',
                ]);
            }

            if ($party > $departure->seatsRemaining()) {
                throw ValidationException::withMessages([
                    'departure_id' => $locale === 'en'
                        ? 'Not enough seats left on this departure for your group.'
                        : 'المقاعد المتبقية في الموعد ده مش كفاية لعدد مجموعتك.',
                ]);
            }

            return Booking::create([
                ...$attributes,
                'departure_id' => $departure->id,
                'travel_date' => $departure->date->format('Y-m-d'),
                'total_price' => Booking::calculateTotal($tour, $attributes['adults'], $attributes['children'], $departure->effectivePrice()),
            ]);
        });
    }

    /** Confirmation page, addressed by the public booking reference. */
    public function show(Booking $booking): Response
    {
        $booking->load(['tour.destination', 'departure', 'review']);

        return Inertia::render('Bookings/Show', [
            'booking' => $booking,
            'canReview' => $booking->canBeReviewed() && $booking->review === null,
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

    /** Accept a departure id only when it is one of the offered ones. */
    private function initialDeparture(mixed $value, array $offeredIds): ?int
    {
        $id = is_numeric($value) ? (int) $value : null;

        return $id !== null && in_array($id, $offeredIds, true) ? $id : null;
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
