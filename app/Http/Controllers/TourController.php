<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Tour;
use App\Models\TourDeparture;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TourController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'destination', 'type', 'max_price', 'sort']);

        $tours = Tour::active()
            ->with('destination')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('title_ar', 'like', "%{$search}%")
                        ->orWhere('title_en', 'like', "%{$search}%")
                        ->orWhere('summary_ar', 'like', "%{$search}%")
                        ->orWhere('summary_en', 'like', "%{$search}%");
                });
            })
            ->when($filters['destination'] ?? null, function ($query, $slug) {
                $query->whereHas('destination', fn ($query) => $query->where('slug', $slug));
            })
            ->when($filters['type'] ?? null, function ($query, $type) {
                if (in_array($type, Tour::TYPES, true)) {
                    $query->where('type', $type);
                }
            })
            ->when($filters['max_price'] ?? null, function ($query, $maxPrice) {
                $query->where('price', '<=', (float) $maxPrice);
            })
            ->when($filters['sort'] ?? 'featured', function ($query, $sort) {
                match ($sort) {
                    'price_asc' => $query->orderBy('price'),
                    'price_desc' => $query->orderByDesc('price'),
                    'rating' => $query->orderByDesc('rating')->orderByDesc('reviews_count'),
                    'duration' => $query->orderBy('duration_days')->orderBy('price'),
                    default => $query->orderByDesc('is_featured')->orderByDesc('rating'),
                };
            })
            ->get();

        return Inertia::render('Tours/Index', [
            'tours' => $tours,
            'destinations' => Destination::ordered()->get(['id', 'slug', 'name_ar', 'name_en']),
            'types' => Tour::TYPES,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'destination' => $filters['destination'] ?? '',
                'type' => $filters['type'] ?? '',
                'max_price' => $filters['max_price'] ?? '',
                'sort' => $filters['sort'] ?? 'featured',
            ],
        ]);
    }

    public function show(Tour $tour): Response
    {
        abort_unless($tour->is_active, 404);

        $tour->load(['destination', 'itineraryDays']);

        return Inertia::render('Tours/Show', [
            'tour' => $tour,
            'departures' => $tour->departures()->upcoming()->get()
                ->map(fn (TourDeparture $departure) => $departure->toPublicArray()),
            'relatedTours' => Tour::active()
                ->with('destination')
                ->where('destination_id', $tour->destination_id)
                ->whereKeyNot($tour->id)
                ->orderByDesc('rating')
                ->limit(3)
                ->get(),
        ]);
    }
}
