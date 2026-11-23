<?php

namespace App\Support;

use App\Models\Tour;
use Illuminate\Support\Collection;

/**
 * Curated tour collections ("ready packages"): hand-picked groups
 * of existing tours by mood — honeymoon, family, adventure. The
 * catalogue is editorial (code), the tours are real DB records
 * resolved in the curated order.
 */
class Collections
{
    public static function catalogue(): array
    {
        return [
            [
                'slug' => 'honeymoon',
                'glyph' => '𓂀',
                'image' => '/images/destinations/aswan.jpg',
                'title_ar' => 'شهر العسل',
                'title_en' => 'Honeymoon',
                'tagline_ar' => 'للأيام الأولى من العمر كله',
                'tagline_en' => 'For the first days of forever',
                'description_ar' => 'رحلات مصممة لاتنين بيبدأوا حكايتهم: مركب نيلية وقت الغروب، فلوكة خاصة في أسوان، ومنطاد فوق الأقصر مع أول ضوء. إيقاع هادي، وخصوصية، ولحظات ما بتتكررش.',
                'description_en' => 'Trips designed for two people starting their story: a Nile cruise at sunset, a private felucca in Aswan, and a balloon over Luxor at first light. A slow pace, privacy, and moments that never repeat.',
                'tour_slugs' => [
                    'nile-cruise-luxor-aswan-4-days',
                    'aswan-felucca-nubian-village',
                    'luxor-sunrise-hot-air-balloon',
                    'sharm-ras-mohammed-white-island',
                ],
            ],
            [
                'slug' => 'family',
                'glyph' => '𓆣',
                'image' => '/images/destinations/cairo-giza.jpg',
                'title_ar' => 'رحلات عائلية',
                'title_en' => 'Family Trips',
                'tagline_ar' => 'ذكريات تتعمل مع بعض',
                'tagline_en' => 'Memories made together',
                'description_ar' => 'رحلات خفيفة وآمنة وممتعة للكبار والصغيرين: الأهرامات والمتحف، شلالات الفيوم، وإسكندرية في يوم. برامج مرنة ووتيرة مريحة — والأطفال بنصف السعر دائمًا.',
                'description_en' => 'Light, safe, joyful trips for grown-ups and little ones alike: the Pyramids and the Museum, Fayoum waterfalls, and Alexandria in a day. Flexible plans at a gentle pace — and children always travel at half price.',
                'tour_slugs' => [
                    'pyramids-egyptian-museum-day-tour',
                    'fayoum-wadi-el-rayan-whales',
                    'alexandria-day-trip-from-cairo',
                    'hurghada-giftun-island-snorkeling',
                ],
            ],
            [
                'slug' => 'adventure',
                'glyph' => '𓅃',
                'image' => '/images/destinations/siwa.jpg',
                'title_ar' => 'مغامرات',
                'title_en' => 'Adventure',
                'tagline_ar' => 'للي قلبه بيجري قبل رجليه',
                'tagline_en' => 'For hearts that run first',
                'description_ar' => 'صحرا وبحر وسما: واحة سيوة بعيونها وكثبانها، منطاد فوق الأقصر، وسنوركلنج فوق شعب البحر الأحمر. دي الرحلات اللي بتتحكي طول العمر.',
                'description_en' => 'Desert, sea and sky: Siwa Oasis with its springs and dunes, a balloon over Luxor, and snorkelling above Red Sea reefs. These are the trips you retell for a lifetime.',
                'tour_slugs' => [
                    'siwa-oasis-adventure-3-days',
                    'luxor-sunrise-hot-air-balloon',
                    'hurghada-giftun-island-snorkeling',
                    'fayoum-wadi-el-rayan-whales',
                    'sharm-ras-mohammed-white-island',
                ],
            ],
        ];
    }

    public static function find(string $slug): ?array
    {
        return collect(self::catalogue())->firstWhere('slug', $slug);
    }

    /** Resolve a collection's tours in its curated order. */
    public static function tours(array $collection): Collection
    {
        $tours = Tour::active()
            ->with('destination')
            ->whereIn('slug', $collection['tour_slugs'])
            ->get()
            ->keyBy('slug');

        return collect($collection['tour_slugs'])
            ->map(fn ($slug) => $tours->get($slug))
            ->filter()
            ->values();
    }

    /** Summaries for cards: the collection plus count + from-price. */
    public static function summaries(): array
    {
        return collect(self::catalogue())
            ->map(function (array $collection) {
                $tours = self::tours($collection);

                return [
                    ...$collection,
                    'tours_count' => $tours->count(),
                    'from_price' => $tours->min('price'),
                ];
            })
            ->all();
    }
}
