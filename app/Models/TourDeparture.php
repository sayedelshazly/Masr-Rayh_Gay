<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class TourDeparture extends Model
{
    protected $fillable = [
        'tour_id',
        'date',
        'time',
        'capacity',
        'price',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'capacity' => 'integer',
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'departure_id');
    }

    /** Active departures from today onward, soonest first. */
    public function scopeUpcoming(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->whereDate('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('time');
    }

    /** Seats held by live bookings (pending holds + confirmed). */
    public function seatsTaken(): int
    {
        return (int) $this->bookings()
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_CONFIRMED])
            ->sum(DB::raw('adults + children'));
    }

    public function seatsRemaining(): int
    {
        return max(0, (int) $this->capacity - $this->seatsTaken());
    }

    public function isSoldOut(): bool
    {
        return $this->seatsRemaining() <= 0;
    }

    /** The price a guest pays on this departure (override wins). */
    public function effectivePrice(): float
    {
        return $this->price !== null ? (float) $this->price : (float) $this->tour->price;
    }

    /** Public shape shared by the tour page and the checkout. */
    public function toPublicArray(): array
    {
        $remaining = $this->seatsRemaining();

        return [
            'id' => $this->id,
            'date' => $this->date->format('Y-m-d'),
            'time' => $this->time ? substr((string) $this->time, 0, 5) : null,
            'capacity' => (int) $this->capacity,
            'price' => $this->price !== null ? (float) $this->price : null,
            'seats_remaining' => $remaining,
            'sold_out' => $remaining <= 0,
        ];
    }
}
