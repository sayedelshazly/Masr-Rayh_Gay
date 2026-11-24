<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Finished trips that still have no review — each row carries a
 * one-tap WhatsApp request with the guest's booking-page link.
 */
class ReviewRequestController extends Controller
{
    public function index(): Response
    {
        $bookings = Booking::with('tour:id,slug,title_ar,title_en')
            ->where('status', Booking::STATUS_CONFIRMED)
            ->whereDate('travel_date', '<', now()->toDateString())
            ->doesntHave('review')
            ->orderByDesc('travel_date')
            ->limit(60)
            ->get()
            ->map(fn (Booking $booking) => [
                'reference' => $booking->reference,
                'tour_title_ar' => $booking->tour->title_ar,
                'tour_title_en' => $booking->tour->title_en,
                'customer_name' => $booking->customer_name,
                'customer_phone' => $booking->customer_phone,
                'travel_date' => $booking->travel_date->format('Y-m-d'),
                'whatsapp_review_url' => $booking->whatsappReviewUrl(),
            ]);

        return Inertia::render('Admin/ReviewRequests/Index', [
            'bookings' => $bookings,
        ]);
    }
}
