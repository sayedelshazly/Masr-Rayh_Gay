<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Tour;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $destinations = Destination::ordered()
            ->withMin('activeTours as from_price', 'price')
            ->withCount('activeTours as tours_count')
            ->get();

        return Inertia::render('Home', [
            // All destinations feed the hero search select; featured ones feed the cards grid.
            'destinations' => $destinations,
            'featuredDestinations' => $destinations->where('is_featured', true)->values(),
            'featuredTours' => Tour::active()
                ->featured()
                ->with('destination')
                ->orderByDesc('rating')
                ->limit(6)
                ->get(),
        ]);
    }
}
