<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyBookingController extends Controller
{
    /**
     * List every booking that belongs to the signed-in user: bookings made
     * while signed in (user_id) plus guest bookings made with the same
     * email address, so nothing a traveler booked is ever "lost".
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $bookings = Booking::query()
            ->where(function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->orWhere('customer_email', $user->email);
            })
            ->with(['tour.destination', 'review'])
            ->orderByDesc('travel_date')
            ->get()
            ->each(function (Booking $booking) {
                $booking->setAttribute('can_review', $booking->canBeReviewed() && $booking->review === null);
                $booking->setAttribute('can_share_photos', $booking->canSharePhotos());
                $booking->setAttribute('has_review', $booking->review !== null);
            });

        return Inertia::render('Bookings/Mine', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Cancel one of the user's own bookings.
     *
     * Rules: only the owner (user_id or matching customer_email) may cancel
     * — anyone else gets 403. Only a pending booking whose travel date is
     * today or in the future can be cancelled — anything else gets 422.
     */
    public function cancel(Request $request, Booking $booking): RedirectResponse
    {
        $user = $request->user();

        $owns = $booking->user_id === $user->id
            || $booking->customer_email === $user->email;

        abort_unless($owns, 403, 'You can only cancel your own bookings.');

        $cancellable = $booking->status === Booking::STATUS_PENDING
            && $booking->travel_date->gte(today());

        abort_unless(
            $cancellable,
            422,
            'Only a pending booking with a future travel date can be cancelled.',
        );

        $booking->update(['status' => Booking::STATUS_CANCELLED]);

        return back();
    }
}
