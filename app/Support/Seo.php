<?php

namespace App\Support;

use App\Models\Destination;
use App\Models\Tour;

/**
 * Search-visibility payloads: each public page passes an `seo`
 * prop (description, image, JSON-LD) that the root Blade template
 * prints into the initial HTML — so crawlers see real structured
 * data without waiting for the app to render.
 */
class Seo
{
    public static function agency(): array
    {
        return [
            '@type' => 'TravelAgency',
            'name' => 'Masr Rayh Gay — مصر رايح جاي',
            'url' => url('/'),
            'logo' => url('/favicon.svg'),
            'image' => url('/images/destinations/cairo-giza.jpg'),
            'telephone' => '+20 109 968 7091',
            'priceRange' => 'EGP',
            'address' => ['@type' => 'PostalAddress', 'addressCountry' => 'EG'],
        ];
    }

    public static function website(): array
    {
        return [
            '@type' => 'WebSite',
            'name' => 'Masr Rayh Gay — مصر رايح جاي',
            'url' => url('/'),
            'inLanguage' => ['ar', 'en'],
        ];
    }

    public static function breadcrumbs(array $items): array
    {
        return [
            '@type' => 'BreadcrumbList',
            'itemListElement' => collect($items)
                ->values()
                ->map(fn (array $item, int $index) => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $item[0],
                    'item' => $item[1],
                ])
                ->all(),
        ];
    }

    /**
     * The seo prop for a tour page. The aggregate rating is only
     * advertised once the tour has real, approved traveller
     * reviews — never with editorial numbers.
     */
    public static function forTour(Tour $tour, bool $hasRealReviews): array
    {
        $trip = [
            '@type' => 'TouristTrip',
            'name' => $tour->title_ar,
            'alternateName' => $tour->title_en,
            'description' => $tour->summary_ar,
            'image' => $tour->image ? url($tour->image) : null,
            'touristType' => 'Travellers',
            'offers' => [
                '@type' => 'Offer',
                'url' => route('tours.show', $tour),
                'price' => (float) $tour->price,
                'priceCurrency' => 'EGP',
                'availability' => 'https://schema.org/InStock',
            ],
        ];

        if ($hasRealReviews) {
            $trip['aggregateRating'] = [
                '@type' => 'AggregateRating',
                'ratingValue' => (float) $tour->rating,
                'reviewCount' => (int) $tour->reviews_count,
            ];
        }

        return [
            'description' => $tour->summary_ar,
            'image' => $tour->image ? url($tour->image) : null,
            'jsonLd' => [
                '@context' => 'https://schema.org',
                '@graph' => [
                    $trip,
                    self::breadcrumbs([
                        ['الرئيسية', url('/')],
                        ['الرحلات', route('tours.index')],
                        [$tour->title_ar, route('tours.show', $tour)],
                    ]),
                ],
            ],
        ];
    }

    public static function forDestination(Destination $destination): array
    {
        return [
            'description' => $destination->tagline_ar ?? $destination->description_ar,
            'image' => $destination->image ? url($destination->image) : null,
            'jsonLd' => [
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'TouristDestination',
                        'name' => $destination->name_ar,
                        'alternateName' => $destination->name_en,
                        'description' => $destination->description_ar,
                        'image' => $destination->image ? url($destination->image) : null,
                    ],
                    self::breadcrumbs([
                        ['الرئيسية', url('/')],
                        ['الوجهات', route('destinations.index')],
                        [$destination->name_ar, route('destinations.show', $destination)],
                    ]),
                ],
            ],
        ];
    }

    public static function forHome(): array
    {
        return [
            'jsonLd' => [
                '@context' => 'https://schema.org',
                '@graph' => [self::agency(), self::website()],
            ],
        ];
    }
}
