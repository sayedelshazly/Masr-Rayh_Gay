<?php

namespace App\Http\Controllers;

use App\Models\Glyph;
use App\Models\Lesson;
use App\Models\QuizQuestion;
use Inertia\Inertia;
use Inertia\Response;

class AcademyController extends Controller
{
    /** Fields the frontend needs for a quiz question (scored client-side at this stage). */
    private function questionProps(QuizQuestion $question): array
    {
        return $question->only([
            'id', 'question_ar', 'question_en', 'options_ar', 'options_en',
            'correct_index', 'explanation_ar', 'explanation_en',
        ]);
    }

    public function index(): Response
    {
        $glyphs = Glyph::ordered()->get();

        // Deterministic "glyph of the day": rotates through the alphabet by day of year.
        $alphabet = $glyphs->where('category', 'alphabet')->values();
        $glyphOfDay = $alphabet->isNotEmpty()
            ? $alphabet[(int) now()->format('z') % $alphabet->count()]
            : null;

        return Inertia::render('Academy/Index', [
            'lessons' => Lesson::ordered()->get([
                'id', 'slug', 'title_ar', 'title_en', 'summary_ar', 'summary_en',
                'level', 'estimated_minutes', 'sort_order',
            ]),
            'featuredGlyphs' => $glyphs->where('category', 'symbol')->take(8)->values(),
            'glyphOfDay' => $glyphOfDay,
            'glyphCount' => $glyphs->count(),
        ]);
    }

    public function glyphs(): Response
    {
        return Inertia::render('Academy/Glyphs', [
            'glyphs' => Glyph::ordered()->get(),
            'categories' => Glyph::CATEGORIES,
        ]);
    }

    public function lesson(Lesson $lesson): Response
    {
        $ordered = Lesson::ordered()->get(['id', 'slug', 'title_ar', 'title_en', 'sort_order']);
        $position = $ordered->search(fn (Lesson $item) => $item->id === $lesson->id);

        return Inertia::render('Academy/Lesson', [
            'lesson' => $lesson->load('quizQuestions'),
            'questions' => $lesson->quizQuestions->map(fn (QuizQuestion $q) => $this->questionProps($q))->values(),
            'previousLesson' => $position > 0 ? $ordered[$position - 1] : null,
            'nextLesson' => $position !== false && $position < $ordered->count() - 1 ? $ordered[$position + 1] : null,
        ]);
    }

    public function name(): Response
    {
        // Seeded alphabet first (transliteration => symbol), then chart
        // fallbacks so every Latin letter A–Z produces output. Digraphs
        // (kh, sh, dj, tj) are included for greedy longest-match parsing.
        $map = [
            'a' => '𓄿', 'b' => '𓃀', 'c' => '𓎡', 'd' => '𓂧', 'e' => '𓇋',
            'f' => '𓆑', 'g' => '𓎼', 'h' => '𓎛', 'i' => '𓇋', 'j' => '𓆓',
            'k' => '𓎡', 'l' => '𓃭', 'm' => '𓅓', 'n' => '𓈖', 'o' => '𓅱',
            'p' => '𓊪', 'q' => '𓈎', 'r' => '𓂋', 's' => '𓋴', 't' => '𓏏',
            'u' => '𓅱', 'v' => '𓆑', 'w' => '𓅱', 'x' => '𓎡𓋴', 'y' => '𓇌',
            'z' => '𓊃',
        ];

        foreach (Glyph::category('alphabet')->ordered()->get() as $glyph) {
            $key = mb_strtolower($glyph->transliteration);
            // Single letters + digraphs only; skip chart-helper rows ('e', 'aa')
            // so they don't shadow the base fallbacks for real letters.
            if (in_array($key, ['kh', 'sh', 'tj', 'dj'], true) || (mb_strlen($key) === 1 && $key !== 'e')) {
                $map[$key] = $glyph->symbol;
            }
        }

        return Inertia::render('Academy/NameTool', [
            'glyphMap' => $map,
            'alphabet' => Glyph::category('alphabet')->ordered()->get(),
        ]);
    }

    public function quiz(): Response
    {
        return Inertia::render('Academy/Quiz', [
            'questions' => QuizQuestion::general()->ordered()->get()
                ->map(fn (QuizQuestion $q) => $this->questionProps($q))->values(),
        ]);
    }
}
