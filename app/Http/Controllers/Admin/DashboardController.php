<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Destination;
use App\Models\Tour;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $byStatus = Booking::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $stats = [
            'total_bookings' => Booking::count(),
            'pending_bookings' => (int) ($byStatus[Booking::STATUS_PENDING] ?? 0),
            'confirmed_revenue' => (float) Booking::where('status', Booking::STATUS_CONFIRMED)->sum('total_price'),
            'total_tours' => Tour::count(),
            'total_destinations' => Destination::count(),
            'total_users' => User::count(),
        ];

        $bookingsByStatus = collect(Booking::STATUSES)
            ->map(fn (string $status) => [
                'status' => $status,
                'count' => (int) ($byStatus[$status] ?? 0),
            ])
            ->values();

        $recentBookings = Booking::with('tour:id,slug,title_ar,title_en')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (Booking $booking) => [
                'reference' => $booking->reference,
                'customer_name' => $booking->customer_name,
                'customer_email' => $booking->customer_email,
                'travel_date' => $booking->travel_date?->format('Y-m-d'),
                'adults' => $booking->adults,
                'children' => $booking->children,
                'total_price' => $booking->total_price,
                'status' => $booking->status,
                'tour' => $booking->tour ? [
                    'slug' => $booking->tour->slug,
                    'title_ar' => $booking->tour->title_ar,
                    'title_en' => $booking->tour->title_en,
                ] : null,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'bookingsByStatus' => $bookingsByStatus,
            'recentBookings' => $recentBookings,
        ]);
    }
}
