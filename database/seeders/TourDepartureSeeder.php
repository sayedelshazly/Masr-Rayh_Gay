<?php

namespace Database\Seeders;

use App\Models\Tour;
use App\Models\TourDeparture;
use Illuminate\Database\Seeder;

class TourDepartureSeeder extends Seeder
{
    /**
     * Give every tour a rolling schedule of upcoming departures:
     * eight dates spread over the next four weeks. Multi-day tours
     * take smaller groups and leave early; the balloon ride is
     * naturally scarce. Every fourth departure carries a small
     * peak-date price override.
     */
    public function run(): void
    {
        $offsets = [2, 5, 9, 12, 16, 19, 23, 26];

        Tour::all()->each(function (Tour $tour) use ($offsets) {
            $multiDay = (int) $tour->duration_days >= 3;
            $capacity = $tour->slug === 'luxor-sunrise-hot-air-balloon'
                ? 8
                : ($multiDay ? 16 : 25);

            foreach ($offsets as $index => $offset) {
                $date = now()->addDays($offset)->toDateString();
                $attributes = [
                    'time' => $multiDay ? '07:00' : '08:00',
                    'capacity' => $capacity,
                    'price' => $index === 3 ? round((float) $tour->price * 1.1, 2) : null,
                    'is_active' => true,
                ];

                $existing = TourDeparture::where('tour_id', $tour->id)->whereDate('date', $date)->first();
                if ($existing) {
                    $existing->update($attributes);
                } else {
                    TourDeparture::create(['tour_id' => $tour->id, 'date' => $date, ...$attributes]);
                }
            }
        });
    }
}
