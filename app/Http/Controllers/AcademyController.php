<?php

namespace App\Http\Controllers;

use App\Models\Glyph;
use App\Models\Lesson;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AcademyController extends Controller
{
    /** Cookie that gives a signed-out visitor a stable quiz history. */
    private const GUEST_COOKIE = 'masr_quiz_guest';

    /** How long a guest keeps their quiz history (one year). */
    private const GUEST_COOKIE_MINUTES = 60 * 24 * 365;

    /**
     * Who owns this attempt: the signed-in account, or a long-lived
     * guest token kept in a cookie so reloads and later visits still
     * find the same visitor's results.
     */
    private function owner(Request $request): array
    {
        if ($user = $request->user()) {
            return ['user_id' => $user->id, 'guest_token' => null];
        }

        $token = $request->cookie(self::GUEST_COOKIE);

        if (! is_string($token) || ! preg_match('/^[A-Za-z0-9-]{16,64}$/', $token)) {
            $token = (string) Str::uuid();
        }

        return ['user_id' => null, 'guest_token' => $token];
    }

    /** The owner's best stored attempt at this quiz, if they have one. */
    private function bestFor(array $owner, ?int $lessonId): ?array
    {
        $query = QuizAttempt::query()
            ->where(function ($query) use ($lessonId) {
                $lessonId === null
                    ? $query->whereNull('lesson_id')
                    : $query->where('lesson_id', $lessonId);
            })
            ->orderByDesc('score')
            ->orderByDesc('id');

        $owner['user_id'] !== null
            ? $query->where('user_id', $owner['user_id'])
            : $query->whereNull('user_id')->where('guest_token', $owner['guest_token']);

        $attempt = $query->first();

        return $attempt ? [
            'score' => $attempt->score,
            'total' => $attempt->total,
            'at' => $attempt->created_at?->toIso8601String(),
        ] : null;
    }

    /** Best attempt for whoever is asking right now. */
    private function bestAttempt(Request $request, ?int $lessonId): ?array
    {
        return $this->bestFor($this->owner($request), $lessonId);
    }

    /**
     * Fields the frontend needs to render a question — never its answer.
     * The answer key and the explanations only come back from `check()`
     * once the visitor has actually submitted their choices.
     */
    private function questionProps(QuizQuestion $question): array
    {
        return $question->only([
            'id', 'question_ar', 'question_en', 'options_ar', 'options_en',
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

    public function lesson(Request $request, Lesson $lesson): Response
    {
        $ordered = Lesson::ordered()->get(['id', 'slug', 'title_ar', 'title_en', 'sort_order']);
        $position = $ordered->search(fn (Lesson $item) => $item->id === $lesson->id);

        // Read the quiz through its own query: touching $lesson->quizQuestions
        // would attach the relation to the model and ship every question -
        // answer key and all - inside the `lesson` prop as well.
        $questions = QuizQuestion::where('lesson_id', $lesson->id)->ordered()->get();

        return Inertia::render('Academy/Lesson', [
            'lesson' => $lesson,
            'questions' => $questions->map(fn (QuizQuestion $q) => $this->questionProps($q))->values(),
            'best' => $this->bestAttempt($request, $lesson->id),
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

    public function quiz(Request $request): Response
    {
        return Inertia::render('Academy/Quiz', [
            'questions' => QuizQuestion::general()->ordered()->get()
                ->map(fn (QuizQuestion $q) => $this->questionProps($q))->values(),
            'best' => $this->bestAttempt($request, null),
        ]);
    }

    /**
     * Grade a submitted quiz. The browser sends only the choices it took
     * and receives the score plus per-question feedback, so the answer
     * key never travels with the page that asks the questions.
     */
    public function check(Request $request): JsonResponse
    {
        $data = $request->validate([
            'lesson' => ['nullable', 'string', 'exists:lessons,slug'],
            'answers' => ['required', 'array', 'min:1'],
            'answers.*' => ['nullable', 'integer', 'min:0'],
        ]);

        $lesson = isset($data['lesson'])
            ? Lesson::where('slug', $data['lesson'])->firstOrFail()
            : null;

        $questions = $lesson
            ? $lesson->quizQuestions()->ordered()->get()
            : QuizQuestion::general()->ordered()->get();

        // Keep only answers for questions that belong to this quiz; anything
        // else a visitor invents is ignored rather than trusted.
        $answers = array_map('intval', array_filter(
            $data['answers'],
            fn ($choice) => $choice !== null,
        ));

        $results = $questions->map(function (QuizQuestion $question) use ($answers) {
            $choice = $answers[$question->id] ?? null;

            return [
                'id' => $question->id,
                'is_correct' => $choice !== null && $choice === $question->correct_index,
                'correct_index' => $question->correct_index,
                'explanation_ar' => $question->explanation_ar,
                'explanation_en' => $question->explanation_en,
            ];
        })->values();

        $score = $results->where('is_correct', true)->count();
        $total = $questions->count();
        $owner = $this->owner($request);
        $previous = $this->bestFor($owner, $lesson?->id);

        QuizAttempt::create([
            'user_id' => $owner['user_id'],
            'guest_token' => $owner['guest_token'],
            'lesson_id' => $lesson?->id,
            'score' => $score,
            'total' => $total,
        ]);

        $response = response()->json([
            'score' => $score,
            'total' => $total,
            'results' => $results,
            'best' => $this->bestFor($owner, $lesson?->id),
            'is_record' => $score > 0 && ($previous === null || $score > $previous['score']),
        ]);

        // Hand a first-time guest the token that will own their history.
        if ($owner['guest_token'] !== null) {
            $response->withCookie(cookie(
                self::GUEST_COOKIE,
                $owner['guest_token'],
                self::GUEST_COOKIE_MINUTES,
                '/',
                null,
                $request->isSecure(),
                true,
                false,
                'lax',
            ));
        }

        return $response;
    }
}
