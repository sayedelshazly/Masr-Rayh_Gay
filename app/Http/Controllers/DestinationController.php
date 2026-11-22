<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Inertia\Inertia;
use Inertia\Response;

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
        return Inertia::render('Destinations/Show', [
            'destination' => $destination,
            'tours' => $destination->activeTours()
                ->with('destination')
                ->orderByDesc('is_featured')
                ->orderByDesc('rating')
                ->get(),
        ]);
    }
}
