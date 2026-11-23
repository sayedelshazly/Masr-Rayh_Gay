<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tour extends Model
{
    use HasFactory;

    /** Tour types used across filters and badges. */
    public const TYPES = ['cultural', 'adventure', 'cruise', 'beach', 'religious', 'desert'];

    protected $fillable = [
        'destination_id',
        'slug',
        'image',
        'title_ar',
        'title_en',
        'summary_ar',
        'summary_en',
        'description_ar',
        'description_en',
        'duration_days',
        'duration_nights',
        'price',
        'currency',
        'old_price',
        'rating',
        'reviews_count',
        'type',
        'is_featured',
        'is_active',
        'includes_ar',
        'includes_en',
        'meeting_point_ar',
        'meeting_point_en',
    ];

    protected function casts(): array
    {
        return [
            'duration_days' => 'integer',
            'duration_nights' => 'integer',
            'price' => 'decimal:2',
            'old_price' => 'decimal:2',
            'rating' => 'decimal:1',
            'reviews_count' => 'integer',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'includes_ar' => 'array',
            'includes_en' => 'array',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function itineraryDays(): HasMany
    {
        return $this->hasMany(TourItineraryDay::class)->orderBy('day_number');
    }

    public function departures(): HasMany
    {
        return $this->hasMany(TourDeparture::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /** Pick a localized column (e.g. title, includes) for the given locale. */
    public function localized(string $field, string $locale): mixed
    {
        $column = $field.'_'.($locale === 'en' ? 'en' : 'ar');

        return $this->{$column} ?? $this->{$field.'_ar'};
    }
}
