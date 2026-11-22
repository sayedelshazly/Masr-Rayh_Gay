<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Glyph extends Model
{
    use HasFactory;

    /** Glyph categories shown in the academy chart. */
    public const CATEGORIES = ['alphabet', 'symbol', 'number'];

    protected $fillable = [
        'symbol',
        'transliteration',
        'name_ar',
        'name_en',
        'meaning_ar',
        'meaning_en',
        'category',
        'pronunciation',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function scopeCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    /** Pick a localized column (e.g. name, meaning) for the given locale. */
    public function localized(string $field, string $locale): mixed
    {
        $column = $field.'_'.($locale === 'en' ? 'en' : 'ar');

        return $this->{$column} ?? $this->{$field.'_ar'};
    }
}
