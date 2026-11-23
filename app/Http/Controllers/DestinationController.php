<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Inertia\Inertia;
use Inertia\Response;
use App\Support\Seo;

class DestinationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Destinations/Index', [
            'destinations' => Destination::ordered()
                ->withMin('activeTours as from_price', 'price')
                ->withCount('activeTours as tours_count')
                ->get(),
        ]);
    }

    public function show(Destination $destination): Response
    {
        $tours = $destination->activeTours()
            ->with('destination')
            ->orderByDesc('is_featured')
            ->orderByDesc('rating')
            ->get();
        \App\Models\Tour::applyRealRatings($tours);

        return Inertia::render('Destinations/Show', [
            'destination' => $destination,
            'tours' => $tours,
            'seo' => Seo::forDestination($destination),
        ]);
    }
}
