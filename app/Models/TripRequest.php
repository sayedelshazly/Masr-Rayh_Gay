<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TripRequest extends Model
{
    public const STATUS_NEW = 'new';

    public const STATUS_CONTACTED = 'contacted';

    public const STATUS_CLOSED = 'closed';

    public const STATUSES = [self::STATUS_NEW, self::STATUS_CONTACTED, self::STATUS_CLOSED];

    public const BUDGETS = ['any', 'under_3000', '3000_7000', '7000_15000', 'over_15000'];

    public const INTERESTS = ['history', 'beach', 'adventure', 'food', 'family', 'luxury'];

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'destinations',
        'start_date',
        'days',
        'adults',
        'children',
        'budget',
        'interests',
        'notes',
        'status',
        'locale',
    ];

    protected function casts(): array
    {
        return [
            'destinations' => 'array',
            'interests' => 'array',
            'start_date' => 'date',
            'days' => 'integer',
            'adults' => 'integer',
            'children' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
