<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use App\Models\Lesson;
use App\Models\Tour;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;

class SeoController extends Controller
{
    /**
     * Dynamic sitemap: static pages plus every active tour,
     * destination and academy lesson, with lastmod stamps.
     */
    public function sitemap(): Response
    {
        $xml = Cache::remember('seo.sitemap', now()->addHour(), function () {
            $urls = collect();

            $static = [
                ['/', '1.0', 'weekly'],
                ['/tours', '0.9', 'daily'],
                ['/destinations', '0.9', 'weekly'],
                ['/plan-your-trip', '0.7', 'monthly'],
                ['/guides', '0.6', 'monthly'],
                ['/gallery', '0.6', 'monthly'],
                ['/privacy', '0.4', 'yearly'],
                ['/film-your-journey', '0.6', 'monthly'],
                ['/academy', '0.8', 'weekly'],
                ['/academy/glyphs', '0.7', 'monthly'],
                ['/academy/name', '0.7', 'monthly'],
                ['/academy/quiz', '0.6', 'monthly'],
            ];
            foreach ($static as [$path, $priority, $freq]) {
                $urls->push(['loc' => url($path), 'priority' => $priority, 'freq' => $freq, 'lastmod' => now()->toDateString()]);
            }

            Tour::active()->get()->each(fn (Tour $tour) => $urls->push([
                'loc' => route('tours.show', $tour),
                'priority' => '0.8',
                'freq' => 'weekly',
                'lastmod' => $tour->updated_at->toDateString(),
            ]));

            Destination::ordered()->get()->each(fn (Destination $destination) => $urls->push([
                'loc' => route('destinations.show', $destination),
                'priority' => '0.8',
                'freq' => 'weekly',
                'lastmod' => $destination->updated_at->toDateString(),
            ]));

            Lesson::all()->each(fn (Lesson $lesson) => $urls->push([
                'loc' => route('academy.lesson', $lesson),
                'priority' => '0.6',
                'freq' => 'monthly',
                'lastmod' => $lesson->updated_at->toDateString(),
            ]));

            $body = $urls->map(fn (array $url) =>
                "    <url>\n"
                ."        <loc>{$url['loc']}</loc>\n"
                ."        <lastmod>{$url['lastmod']}</lastmod>\n"
                ."        <changefreq>{$url['freq']}</changefreq>\n"
                ."        <priority>{$url['priority']}</priority>\n"
                .'    </url>'
            )->implode("\n");

            return '<?xml version="1.0" encoding="UTF-8"?>'."\n"
                .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n"
                .$body."\n</urlset>";
        });

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }

    /** Robots: everything public is welcome; accounts and admin are not indexed. */
    public function robots(): Response
    {
        $lines = implode("\n", [
            'User-agent: *',
            'Disallow: /admin',
            'Disallow: /my-bookings',
            'Disallow: /booking/',
            'Disallow: /login',
            'Disallow: /register',
            '',
            'Sitemap: '.url('/sitemap.xml'),
            '',
        ]);

        return response($lines, 200, ['Content-Type' => 'text/plain']);
    }
}
