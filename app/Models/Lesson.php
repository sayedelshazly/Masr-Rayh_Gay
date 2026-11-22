<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory;

    /** Lesson difficulty levels. */
    public const LEVELS = ['beginner', 'intermediate'];

    protected $fillable = [
        'slug',
        'title_ar',
        'title_en',
        'summary_ar',
        'summary_en',
        'content_ar',
        'content_en',
        'level',
        'sort_order',
        'estimated_minutes',
    ];

    protected function casts(): array
    {
        return [
            'content_ar' => 'array', // [{heading, body}, ...]
            'content_en' => 'array',
            'sort_order' => 'integer',
            'estimated_minutes' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function quizQuestions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class)->orderBy('sort_order')->orderBy('id');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    /** Pick a localized column (e.g. title, summary, content) for the given locale. */
    public function localized(string $field, string $locale): mixed
    {
        $column = $field.'_'.($locale === 'en' ? 'en' : 'ar');

        return $this->{$column} ?? $this->{$field.'_ar'};
    }
}
