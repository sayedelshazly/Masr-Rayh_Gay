<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use App\Support\Collections;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Collections/Index', [
            'collections' => Collections::summaries(),
        ]);
    }

    public function show(string $slug): Response
    {
        $collection = Collections::find($slug);

        abort_if($collection === null, 404);

        $tours = Collections::tours($collection);
        Tour::applyRealRatings($tours);

        return Inertia::render('Collections/Show', [
            'collection' => $collection,
            'tours' => $tours,
            'others' => collect(Collections::summaries())
                ->where('slug', '!=', $slug)
                ->values(),
        ]);
    }
}
