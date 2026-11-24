<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FilmRequest extends Model
{
    /** Cinematic packages: key => price in EGP (flat, per trip). */
    public const PACKAGES = [
        'photo' => 4500,
        'film' => 9500,
        'royal' => 16000,
    ];

    public const STATUS_NEW = 'new';

    public const STATUS_CONTACTED = 'contacted';

    public const STATUS_CLOSED = 'closed';

    public const STATUSES = [self::STATUS_NEW, self::STATUS_CONTACTED, self::STATUS_CLOSED];

    protected $fillable = [
        'package',
        'tour_id',
        'travel_date',
        'name',
        'phone',
        'email',
        'notes',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'travel_date' => 'date',
        ];
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }
}
