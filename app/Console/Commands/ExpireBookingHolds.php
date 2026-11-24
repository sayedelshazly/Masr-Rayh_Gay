<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Command;

class ExpireBookingHolds extends Command
{
    protected $signature = 'bookings:expire-holds';

    protected $description = 'Release seats held by pending departure bookings older than the hold window';

    /**
     * A pending booking against a scheduled departure holds its
     * seats for Booking::HOLD_MINUTES; past that, the booking
     * expires and the seats return to the pool. Free-date bookings
     * (no departure) never expire — the team follows those up.
     */
    public function handle(): int
    {
        $expired = Booking::where('status', Booking::STATUS_PENDING)
            ->whereNotNull('departure_id')
            ->where('created_at', '<=', now()->subMinutes(Booking::holdMinutes()))
            ->update(['status' => Booking::STATUS_EXPIRED]);

        $this->info("Expired {$expired} booking hold(s).");

        return self::SUCCESS;
    }
}
