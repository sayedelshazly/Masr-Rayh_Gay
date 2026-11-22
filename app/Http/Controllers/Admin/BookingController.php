<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['status', 'search']);

        $bookings = Booking::with('tour:id,slug,title_ar,title_en')
            ->when($filters['status'] ?? null, function ($query, $status) {
                if (in_array($status, Booking::STATUSES, true)) {
                    $query->where('status', $status);
                }
            })
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('reference', 'like', "%{$search}%")
                        ->orWhere('customer_email', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'statuses' => Booking::STATUSES,
            'filters' => [
                'status' => $filters['status'] ?? '',
                'search' => $filters['search'] ?? '',
            ],
        ]);
    }

    public function show(Booking $booking): Response
    {
        $booking->load(['tour.destination', 'user:id,name,email']);

        return Inertia::render('Admin/Bookings/Show', [
            'booking' => $booking,
            'statuses' => Booking::STATUSES,
        ]);
    }

    public function updateStatus(Request $request, Booking $booking): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(Booking::STATUSES)],
        ]);

        $booking->update(['status' => $validated['status']]);

        return back();
    }
}
