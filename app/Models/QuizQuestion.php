<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'question_ar',
        'question_en',
        'options_ar',
        'options_en',
        'correct_index',
        'explanation_ar',
        'explanation_en',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'options_ar' => 'array',
            'options_en' => 'array',
            'correct_index' => 'integer',
            'sort_order' => 'integer',
        ];
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    /** Questions that belong to the standalone general quiz (no lesson). */
    public function scopeGeneral(Builder $query): Builder
    {
        return $query->whereNull('lesson_id');
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
