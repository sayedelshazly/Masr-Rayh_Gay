<?php

namespace Tests\Feature;

use App\Models\Glyph;
use App\Models\Lesson;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use App\Models\User;
use Database\Seeders\GlyphSeeder;
use Database\Seeders\LessonSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AcademyTest extends TestCase
{
    use RefreshDatabase;

    public function test_academy_index_returns_200_with_lessons_and_glyphs(): void
    {
        $this->seed([GlyphSeeder::class, LessonSeeder::class]);

        $response = $this->get('/academy');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Academy/Index')
            ->has('lessons', 4)
            ->has('featuredGlyphs', 8)
            ->has('glyphOfDay')
            ->where('glyphCount', Glyph::count())
        );
    }

    public function test_glyphs_chart_returns_200_with_all_seeded_glyphs(): void
    {
        $this->seed(GlyphSeeder::class);

        $this->assertGreaterThan(25, Glyph::count());

        $response = $this->get('/academy/glyphs');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Academy/Glyphs')
            ->has('glyphs', Glyph::count())
            ->where('categories', Glyph::CATEGORIES)
        );
    }

    public function test_lesson_page_returns_200_with_sections_and_its_quiz_questions(): void
    {
        $this->seed(LessonSeeder::class);
        $lesson = Lesson::where('slug', 'what-is-hieroglyphic-writing')->firstOrFail();

        $response = $this->get('/academy/lessons/'.$lesson->slug);

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Academy/Lesson')
            ->where('lesson.slug', $lesson->slug)
            ->has('questions', $lesson->quizQuestions()->count())
            ->has('nextLesson')
        );
    }

    public function test_unknown_lesson_slug_returns_404(): void
    {
        $this->get('/academy/lessons/no-such-lesson')->assertNotFound();
    }

    public function test_name_tool_returns_200_with_glyph_map_covering_the_alphabet(): void
    {
        $this->seed(GlyphSeeder::class);

        $response = $this->get('/academy/name');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Academy/NameTool')
            ->has('glyphMap')
            ->where('glyphMap.a', '𓄿')
            ->where('glyphMap.m', '𓅓')
            ->has('glyphMap.kh')
            ->has('glyphMap.sh')
            ->has('alphabet')
        );
    }

    public function test_general_quiz_returns_200_with_five_general_questions(): void
    {
        $this->seed(LessonSeeder::class);

        $response = $this->get('/academy/quiz');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Academy/Quiz')
            ->has('questions', 5)
        );
    }

    public function test_academy_is_public_for_guests(): void
    {
        $this->seed([GlyphSeeder::class, LessonSeeder::class]);

        foreach (['/academy', '/academy/glyphs', '/academy/name', '/academy/quiz'] as $url) {
            $this->get($url)->assertOk();
        }
    }

    public function test_quiz_pages_never_ship_the_answer_key(): void
    {
        $this->seed(LessonSeeder::class);
        $lesson = Lesson::where('slug', 'what-is-hieroglyphic-writing')->firstOrFail();

        $this->get('/academy/lessons/'.$lesson->slug)
            ->assertInertia(fn (Assert $page) => $page
                ->has('questions.0.options_ar')
                ->missing('questions.0.correct_index')
                ->missing('questions.0.explanation_ar')
                ->missing('questions.0.explanation_en')
                ->missing('lesson.quiz_questions')
            );

        $this->get('/academy/quiz')
            ->assertInertia(fn (Assert $page) => $page
                ->missing('questions.0.correct_index')
                ->missing('questions.0.explanation_ar')
            );
    }

    public function test_the_server_scores_a_perfect_quiz(): void
    {
        $this->seed(LessonSeeder::class);

        $questions = QuizQuestion::general()->ordered()->get();
        $this->assertNotEmpty($questions);

        $answers = $questions->mapWithKeys(fn (QuizQuestion $q) => [$q->id => $q->correct_index])->all();

        $this->postJson('/academy/quiz/check', ['answers' => $answers])
            ->assertOk()
            ->assertJsonPath('score', $questions->count())
            ->assertJsonPath('total', $questions->count())
            ->assertJsonCount($questions->count(), 'results')
            ->assertJsonPath('results.0.is_correct', true);
    }

    public function test_the_server_scores_wrong_and_missing_answers_as_incorrect(): void
    {
        $this->seed(LessonSeeder::class);

        $questions = QuizQuestion::general()->ordered()->get();
        $wrong = $questions->mapWithKeys(function (QuizQuestion $q) {
            $options = $q->options_ar ?: $q->options_en ?: [];

            return [$q->id => ($q->correct_index + 1) % max(count($options), 2)];
        })->all();

        // Drop the first question's answer entirely: an unanswered
        // question must count as wrong, not as a free point.
        $answers = $wrong;
        unset($answers[$questions->first()->id]);

        $this->postJson('/academy/quiz/check', ['answers' => $answers])
            ->assertOk()
            ->assertJsonPath('total', $questions->count())
            ->assertJsonPath('score', 0);
    }

    public function test_a_lesson_quiz_only_grades_its_own_questions(): void
    {
        $this->seed(LessonSeeder::class);
        $lesson = Lesson::where('slug', 'what-is-hieroglyphic-writing')->firstOrFail();

        $own = $lesson->quizQuestions()->ordered()->get();
        $foreign = QuizQuestion::general()->firstOrFail();

        $answers = $own->mapWithKeys(fn (QuizQuestion $q) => [$q->id => $q->correct_index])->all();
        $answers[$foreign->id] = $foreign->correct_index;

        $this->postJson('/academy/quiz/check', ['lesson' => $lesson->slug, 'answers' => $answers])
            ->assertOk()
            ->assertJsonPath('total', $own->count())
            ->assertJsonPath('score', $own->count());
    }

    public function test_guest_attempts_are_stored_and_the_best_score_survives_a_reload(): void
    {
        $this->seed(LessonSeeder::class);

        $questions = QuizQuestion::general()->ordered()->get();
        $perfect = $questions->mapWithKeys(fn (QuizQuestion $q) => [$q->id => $q->correct_index])->all();
        $oneRight = array_slice($perfect, 0, 1, true);
        $token = (string) Str::uuid();

        $this->withCredentials()
            ->withCookie('masr_quiz_guest', $token)
            ->postJson('/academy/quiz/check', ['answers' => $oneRight])
            ->assertOk()
            ->assertJsonPath('score', 1)
            ->assertJsonPath('best.score', 1)
            ->assertJsonPath('is_record', true);

        $this->withCredentials()
            ->withCookie('masr_quiz_guest', $token)
            ->postJson('/academy/quiz/check', ['answers' => $perfect])
            ->assertOk()
            ->assertJsonPath('score', $questions->count())
            ->assertJsonPath('best.score', $questions->count())
            ->assertJsonPath('is_record', true);

        $this->assertSame(2, QuizAttempt::count());
        $this->assertNull(QuizAttempt::first()->user_id);

        $this->withCookie('masr_quiz_guest', $token)
            ->get('/academy/quiz')
            ->assertInertia(fn (Assert $page) => $page
                ->where('best.score', $questions->count())
                ->where('best.total', $questions->count())
            );
    }

    public function test_a_weaker_attempt_does_not_replace_the_best_score(): void
    {
        $this->seed(LessonSeeder::class);
        $lesson = Lesson::where('slug', 'what-is-hieroglyphic-writing')->firstOrFail();

        $questions = $lesson->quizQuestions()->ordered()->get();
        $perfect = $questions->mapWithKeys(fn (QuizQuestion $q) => [$q->id => $q->correct_index])->all();
        $oneRight = array_slice($perfect, 0, 1, true);
        $token = (string) Str::uuid();

        $this->withCredentials()
            ->withCookie('masr_quiz_guest', $token)
            ->postJson('/academy/quiz/check', ['lesson' => $lesson->slug, 'answers' => $perfect])
            ->assertOk();

        $this->withCredentials()
            ->withCookie('masr_quiz_guest', $token)
            ->postJson('/academy/quiz/check', ['lesson' => $lesson->slug, 'answers' => $oneRight])
            ->assertOk()
            ->assertJsonPath('score', 1)
            ->assertJsonPath('best.score', $questions->count())
            ->assertJsonPath('is_record', false);

        $this->withCookie('masr_quiz_guest', $token)
            ->get('/academy/lessons/'.$lesson->slug)
            ->assertInertia(fn (Assert $page) => $page->where('best.score', $questions->count()));
    }

    public function test_signed_in_attempts_belong_to_the_user_and_are_not_shared(): void
    {
        $this->seed(LessonSeeder::class);

        $questions = QuizQuestion::general()->ordered()->get();
        $perfect = $questions->mapWithKeys(fn (QuizQuestion $q) => [$q->id => $q->correct_index])->all();
        $owner = User::factory()->create();
        $someoneElse = User::factory()->create();

        $this->actingAs($owner)
            ->postJson('/academy/quiz/check', ['answers' => $perfect])
            ->assertOk()
            ->assertJsonPath('best.score', $questions->count());

        $this->assertSame($owner->id, QuizAttempt::first()->user_id);

        $this->actingAs($someoneElse)
            ->get('/academy/quiz')
            ->assertInertia(fn (Assert $page) => $page->where('best', null));
    }

    public function test_factories_create_related_lesson_and_questions(): void
    {
        $lesson = Lesson::factory()->beginner()->create();
        QuizQuestion::factory()->count(3)->forLesson($lesson)->create();
        Glyph::factory()->alphabet()->count(2)->create();

        $this->assertSame(3, $lesson->quizQuestions()->count());
        $this->assertSame(2, Glyph::category('alphabet')->count());
        $this->assertSame(0, QuizQuestion::general()->count());
    }
}
