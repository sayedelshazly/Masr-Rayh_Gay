<?php

namespace App\Http\Controllers;

use App\Support\Guides;
use Inertia\Inertia;
use Inertia\Response;

class GuidesController extends Controller
{
    public function index(): Response
    {
        $guides = Guides::all();

        return Inertia::render('Guides/Index', [
            'guides' => $guides,
            'totals' => [
                'guides' => count($guides),
                'trips' => array_sum(array_column($guides, 'trips')),
                'languages' => count(array_unique(array_merge(...array_column($guides, 'languages')))),
            ],
        ]);
    }
}
