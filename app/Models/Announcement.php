<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * The site-wide announcement bar. Managed as a single row from
 * the admin; only an active one is shared with the site.
 */
class Announcement extends Model
{
    protected $fillable = ['text_ar', 'text_en', 'link', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /** The single editable announcement, created on first use. */
    public static function singleton(): self
    {
        return static::firstOrCreate([], [
            'text_ar' => '',
            'text_en' => '',
            'is_active' => false,
        ]);
    }

    /** The announcement to show visitors right now, if any. */
    public static function current(): ?self
    {
        $announcement = static::singleton();

        return $announcement->is_active && trim($announcement->text_ar) !== '' ? $announcement : null;
    }
}
