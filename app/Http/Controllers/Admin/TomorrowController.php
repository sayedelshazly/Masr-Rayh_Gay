<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Tomorrow's confirmed trips in one place, each with a
 * one-tap WhatsApp reminder — the morning routine page.
 */
class TomorrowController extends Controller
{
    public function index(): Response
    {
        $tomorrow = now()->addDay()->toDateString();

        $bookings = Booking::with(['tour:id,slug,title_ar,title_en', 'departure:id,date,time'])
            ->whereDate('travel_date', $tomorrow)
            ->where('status', Booking::STATUS_CONFIRMED)
            ->get()
            ->sortBy(fn (Booking $booking) => $booking->departure?->time ?? '99:99')
            ->values()
            ->map(fn (Booking $booking) => [
                'reference' => $booking->reference,
                'tour_title_ar' => $booking->tour->title_ar,
                'tour_title_en' => $booking->tour->title_en,
                'customer_name' => $booking->customer_name,
                'customer_phone' => $booking->customer_phone,
                'customer_email' => $booking->customer_email,
                'adults' => $booking->adults,
                'children' => $booking->children,
                'total_price' => (float) $booking->total_price,
                'departure_time' => $booking->departure?->time ? substr((string) $booking->departure->time, 0, 5) : null,
                'whatsapp_reminder_url' => $booking->whatsappReminderUrl(),
            ]);

        return Inertia::render('Admin/Tomorrow', [
            'date' => $tomorrow,
            'bookings' => $bookings,
            'totalTravellers' => $bookings->sum(fn (array $row) => $row['adults'] + $row['children']),
        ]);
    }
}
