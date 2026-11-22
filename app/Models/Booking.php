<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_CONFIRMED = 'confirmed';

    public const STATUS_CANCELLED = 'cancelled';

    /** All valid booking statuses. */
    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_CONFIRMED,
        self::STATUS_CANCELLED,
    ];

    protected $fillable = [
        'tour_id',
        'user_id',
        'reference',
        'customer_name',
        'customer_email',
        'customer_phone',
        'travel_date',
        'adults',
        'children',
        'total_price',
        'status',
        'notes',
        'locale',
    ];

    protected function casts(): array
    {
        return [
            'travel_date' => 'date',
            'adults' => 'integer',
            'children' => 'integer',
            'total_price' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            if (empty($booking->reference)) {
                $booking->reference = static::generateReference();
            }

            if (empty($booking->status)) {
                $booking->status = self::STATUS_PENDING;
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'reference';
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForReference(Builder $query, string $reference): Builder
    {
        return $query->where('reference', $reference);
    }

    public static function findByReference(string $reference): ?static
    {
        return static::forReference($reference)->first();
    }

    /**
     * Generate a unique public booking reference, e.g. MRG-AB12CD.
     * Retries until an unused value is found (the column is also unique).
     */
    public static function generateReference(): string
    {
        do {
            $reference = 'MRG-'.strtoupper(Str::random(6));
        } while (static::where('reference', $reference)->exists());

        return $reference;
    }

    /**
     * The one and only price rule — always computed server-side:
     * adults pay full price, children pay 50%.
     */
    public static function calculateTotal(Tour $tour, int $adults, int $children): float
    {
        return round(((float) $tour->price * $adults) + (((float) $tour->price * 0.5) * $children), 2);
    }
}
