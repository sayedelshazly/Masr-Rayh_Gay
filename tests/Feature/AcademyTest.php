<?php

namespace Tests\Feature;

use App\Models\Glyph;
use App\Models\Lesson;
use App\Models\QuizQuestion;
use Database\Seeders\GlyphSeeder;
use Database\Seeders\LessonSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
