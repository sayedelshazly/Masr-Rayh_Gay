<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * The site's single settings row, edited from the admin dashboard:
 * contact channels, the seat-hold window, and feature switches for
 * the public contribution flows (reviews, photos, film, trip design).
 */
class SiteSetting extends Model
{
    protected $fillable = [
        'whatsapp_number', 'contact_email', 'hold_minutes',
        'reviews_enabled', 'photos_enabled', 'film_enabled', 'plan_enabled',
    ];

    protected $casts = [
        'hold_minutes' => 'integer',
        'reviews_enabled' => 'boolean',
        'photos_enabled' => 'boolean',
        'film_enabled' => 'boolean',
        'plan_enabled' => 'boolean',
    ];

    /** The one settings row, created with defaults on first use. */
    public static function singleton(): static
    {
        $setting = static::query()->firstOrCreate([], ['hold_minutes' => Booking::HOLD_MINUTES]);

        // A freshly created model does not carry the columns' DB
        // defaults (the feature switches) until it is re-read.
        return $setting->wasRecentlyCreated ? $setting->refresh() : $setting;
    }

    /** Feature switches in the shape the frontend expects. */
    public function features(): array
    {
        return [
            'reviews' => $this->reviews_enabled,
            'photos' => $this->photos_enabled,
            'film' => $this->film_enabled,
            'plan' => $this->plan_enabled,
        ];
    }
}
