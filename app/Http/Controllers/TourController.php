<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Tour;
use App\Models\TourDeparture;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Support\Seo;

class TourController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'destination', 'type', 'max_price', 'sort']);

        $tours = Tour::active()
            ->with('destination')
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    // Case-insensitive on every driver (ILIKE on PostgreSQL,
                    // LIKE on MySQL/SQLite), so "luxor" finds "Luxor".
                    $query->whereLike('title_ar', "%{$search}%")
                        ->orWhereLike('title_en', "%{$search}%")
                        ->orWhereLike('summary_ar', "%{$search}%")
                        ->orWhereLike('summary_en', "%{$search}%");
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

        Tour::applyRealRatings($tours);

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
        Tour::applyRealRatings([$tour]);

        $reviews = $tour->reviews()->approved()->latest()->limit(10)->get()
            ->map(fn ($review) => [
                'id' => $review->id,
                'author_name' => $review->author_name,
                'rating' => $review->rating,
                'body' => $review->body,
                'created_at' => $review->created_at->format('Y-m-d'),
            ]);
        $related = Tour::active()
            ->with('destination')
            ->where('destination_id', $tour->destination_id)
            ->whereKeyNot($tour->id)
            ->orderByDesc('rating')
            ->limit(3)
            ->get();
        Tour::applyRealRatings($related);

        return Inertia::render('Tours/Show', [
            'tour' => $tour,
            'reviews' => $reviews,
            'seo' => Seo::forTour($tour, $reviews->isNotEmpty()),
            'departures' => $tour->departures()->upcoming()->get()
                ->map(fn (TourDeparture $departure) => $departure->toPublicArray()),
            'relatedTours' => $related,
        ]);
    }
}
