<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    /**
     * Submit the review for a finished trip. The booking reference
     * in the URL is the capability — guests booked without accounts,
     * so whoever holds the reference (the traveller) may review.
     * One review per booking; it goes live after admin moderation.
     */
    public function store(Request $request, Booking $booking): RedirectResponse
    {
        if ($booking->review()->exists()) {
            throw ValidationException::withMessages([
                'body' => $request->input('locale') === 'en'
                    ? 'This booking already has a review.'
                    : 'الحجز ده اتقيّم قبل كده.',
            ]);
        }

        abort_unless($booking->canBeReviewed(), 422);

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'body' => ['required', 'string', 'min:3', 'max:1000'],
        ]);

        $booking->review()->create([
            'tour_id' => $booking->tour_id,
            'user_id' => $booking->user_id,
            'author_name' => $booking->customer_name,
            'rating' => $validated['rating'],
            'body' => $validated['body'],
            'is_approved' => false,
        ]);

        return back();
    }
}
