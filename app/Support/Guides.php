<?php

namespace App\Support;

/**
 * The guides team — an editorial catalogue, like the tours'
 * collections before it. Photos are free Pexels portraits used
 * as placeholders until the real team's photos are shot
 * (see docs/IMAGE_CREDITS.md).
 */
class Guides
{
    public static function all(): array
    {
        return [
            [
                'slug' => 'ahmed-elshazly',
                'name_ar' => 'أحمد الشاذلي',
                'name_en' => 'Ahmed El-Shazly',
                'role_ar' => 'كبير المرشدين — التاريخ الفرعوني',
                'role_en' => 'Head guide — Pharaonic history',
                'bio_ar' => 'خريج آثار القاهرة وحاصل على ماجستير في علم المصريات. بيحوّل أي معبد لحكاية، وبيعرف يقولك الحجر ده اتنحت إمتى وليه.',
                'bio_en' => 'A Cairo archaeology graduate with a master\'s in Egyptology. He turns every temple into a story, and can tell you when each stone was carved — and why.',
                'languages' => ['ar', 'en', 'fr'],
                'years' => 12,
                'trips' => 420,
                'rating' => 4.9,
                'image' => '/images/guides/ahmed-elshazly.jpg',
                'glyph' => '𓂀',
            ],
            [
                'slug' => 'sara-nabil',
                'name_ar' => 'سارة نبيل',
                'name_en' => 'Sara Nabil',
                'role_ar' => 'مرشدة القاهرة والجيزة',
                'role_en' => 'Cairo & Giza guide',
                'bio_ar' => 'متخصصة في القاهرة الإسلامية والأهرامات، وأسلوبها خفيف ومنظم — العائلات والأطفال بيحبوها، والتصوير معاها له أماكن سرية.',
                'bio_en' => 'Specialist in Islamic Cairo and the Pyramids, with a light, organised style — families and kids love her, and she knows the secret photo spots.',
                'languages' => ['ar', 'en', 'de'],
                'years' => 8,
                'trips' => 350,
                'rating' => 5.0,
                'image' => '/images/guides/sara-nabil.jpg',
                'glyph' => '𓋹',
            ],
            [
                'slug' => 'mahmoud-hassan',
                'name_ar' => 'محمود حسن',
                'name_en' => 'Mahmoud Hassan',
                'role_ar' => 'مرشد الأقصر وأسوان',
                'role_en' => 'Luxor & Aswan guide',
                'bio_ar' => 'ابن الأقصر نفسه — اتربى بين المعابد وبيعرف المدينة حجر حجر. رحلاته في وادي الملوك وأبو سمبل هي الأعلى تقييمًا عندنا.',
                'bio_en' => 'A Luxor native who grew up among the temples and knows the city stone by stone. His Valley of the Kings and Abu Simbel trips are our highest rated.',
                'languages' => ['ar', 'en', 'es'],
                'years' => 10,
                'trips' => 380,
                'rating' => 4.9,
                'image' => '/images/guides/mahmoud-hassan.jpg',
                'glyph' => '𓅃',
            ],
            [
                'slug' => 'nourhan-ali',
                'name_ar' => 'نورهان علي',
                'name_en' => 'Nourhan Ali',
                'role_ar' => 'مرشدة البحر الأحمر والمغامرات',
                'role_en' => 'Red Sea & adventure guide',
                'bio_ar' => 'غواصة معتمدة ومرشدة سفاري — البحر الأحمر وسيوة ملعبها. معاها هتشوف الشعاب المرجانية والكثبان بعين اللي عايشة هناك.',
                'bio_en' => 'A certified diver and safari guide — the Red Sea and Siwa are her playground. With her you see reefs and dunes through the eyes of someone who lives there.',
                'languages' => ['ar', 'en', 'ru'],
                'years' => 6,
                'trips' => 260,
                'rating' => 4.8,
                'image' => '/images/guides/nourhan-ali.jpg',
                'glyph' => '𓆣',
            ],
        ];
    }
}
