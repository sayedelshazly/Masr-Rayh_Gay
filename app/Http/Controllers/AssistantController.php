<?php

namespace App\Http\Controllers;

use App\Models\Tour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * The rule-based trip assistant: three answers (destination
 * mood, budget, trip length) are scored against the catalogue.
 * When nothing matches every answer, constraints relax one by
 * one — budget first, then length, then destination — and the
 * response says so, so the traveller always gets suggestions.
 */
class AssistantController extends Controller
{
    /** Destination moods offered in the chat → destination slugs. */
    private const GROUPS = [
        'giza' => ['cairo-giza'],
        'luxor' => ['luxor'],
        'aswan' => ['aswan'],
        'redsea' => ['hurghada', 'sharm-el-sheikh'],
        'oasis' => ['siwa', 'fayoum'],
        'alex' => ['alexandria'],
    ];

    private const BUDGETS = [
        'under_2000' => [0, 2000],
        '2000_5000' => [2000, 5000],
        '5000_10000' => [5000, 10000],
        'over_10000' => [10000, PHP_INT_MAX],
    ];

    public function recommend(Request $request): JsonResponse
    {
        $data = $request->validate([
            'group' => ['nullable', 'string', 'in:'.implode(',', [...array_keys(self::GROUPS), 'any'])],
            'budget' => ['nullable', 'string', 'in:'.implode(',', [...array_keys(self::BUDGETS), 'any'])],
            'length' => ['nullable', 'string', 'in:day,short,long,any'],
        ]);

        $group = $data['group'] ?? 'any';
        $budget = $data['budget'] ?? 'any';
        $length = $data['length'] ?? 'any';

        $tours = Tour::active()->with('destination')->get();
        Tour::applyRealRatings($tours);

        // Relaxation ladder: strict first, then drop budget,
        // then length, then the destination mood itself.
        $ladder = [
            [$group, $budget, $length, false],
            [$group, 'any', $length, true],
            [$group, 'any', 'any', true],
            ['any', 'any', 'any', true],
        ];

        $picked = collect();
        $relaxed = false;
        foreach ($ladder as [$g, $b, $l, $isRelaxed]) {
            $picked = $tours
                ->map(fn (Tour $tour) => ['tour' => $tour, 'score' => $this->score($tour, $g, $b, $l)])
                ->filter(fn (array $row) => $row['score'] !== null)
                ->sortByDesc(fn (array $row) => [$row['score'], (float) $row['tour']->rating])
                ->take(3)
                ->values();
            $relaxed = $isRelaxed;
            if ($picked->isNotEmpty()) {
                break;
            }
        }

        return response()->json([
            'relaxed' => $relaxed && ($group !== 'any' || $budget !== 'any' || $length !== 'any'),
            'tours' => $picked->map(fn (array $row) => [
                'slug' => $row['tour']->slug,
                'title_ar' => $row['tour']->title_ar,
                'title_en' => $row['tour']->title_en,
                'price' => (float) $row['tour']->price,
                'duration_days' => $row['tour']->duration_days,
                'rating' => (float) $row['tour']->rating,
                'image' => $row['tour']->image,
                'destination_ar' => $row['tour']->destination->name_ar,
                'destination_en' => $row['tour']->destination->name_en,
                'url' => route('tours.show', $row['tour']),
            ])->all(),
        ]);
    }

    /** Null when the tour breaks a hard (non-relaxed) constraint. */
    private function score(Tour $tour, string $group, string $budget, string $length): ?int
    {
        $score = 0;

        if ($group !== 'any') {
            if (! in_array($tour->destination->slug, self::GROUPS[$group], true)) {
                return null;
            }
            $score += 3;
        }

        if ($budget !== 'any') {
            [$min, $max] = self::BUDGETS[$budget];
            if ($tour->price < $min || $tour->price > $max) {
                return null;
            }
            $score += 2;
        }

        if ($length !== 'any') {
            $days = $tour->duration_days;
            $fits = match ($length) {
                'day' => $days === 1,
                'short' => $days >= 2 && $days <= 3,
                'long' => $days >= 4,
            };
            if (! $fits) {
                return null;
            }
            $score += 2;
        }

        if ($tour->is_featured) {
            $score += 1;
        }

        return $score;
    }
}
