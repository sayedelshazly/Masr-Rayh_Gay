<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class GalleryPhoto extends Model
{
    /** A booking may share at most this many photos. */
    public const MAX_PER_BOOKING = 6;

    protected $fillable = ['booking_id', 'image', 'caption', 'is_approved'];

    protected $casts = ['is_approved' => 'boolean'];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('is_approved', true);
    }

    public function url(): string
    {
        return Storage::disk('public')->url($this->image);
    }
}
