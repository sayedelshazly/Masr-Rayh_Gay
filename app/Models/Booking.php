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

    public const STATUS_EXPIRED = 'expired';

    /** Minutes a pending departure booking holds its seats. */
    public const HOLD_MINUTES = 15;

    /** All valid booking statuses. */
    public const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_CONFIRMED,
        self::STATUS_CANCELLED,
        self::STATUS_EXPIRED,
    ];

    protected $fillable = [
        'tour_id',
        'departure_id',
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

    public function departure(): BelongsTo
    {
        return $this->belongsTo(TourDeparture::class, 'departure_id');
    }

    public function review(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Review::class);
    }

    /**
     * A booking can be reviewed once its trip actually happened:
     * confirmed, and the travel date is in the past.
     */
    /**
     * A wa.me link to the guest with a ready-made confirmation
     * message — the admin confirms a booking in one tap.
     * Egyptian local numbers (01xxxxxxxxx) become +20 format.
     */
    /** The guest's number in wa.me format, or null when unusable. */
    private function whatsappPhone(): ?string
    {
        $digits = preg_replace('/\D+/', '', $this->customer_phone ?? '');

        if (strlen($digits) < 10) {
            return null;
        }

        if (str_starts_with($digits, '0020')) {
            $digits = substr($digits, 2);
        } elseif (str_starts_with($digits, '01')) {
            $digits = '20'.substr($digits, 1);
        }

        return $digits;
    }

    public function whatsappUrl(): ?string
    {
        $digits = $this->whatsappPhone();

        if ($digits === null) {
            return null;
        }

        $people = $this->adults + $this->children;
        $when = $this->travel_date->format('Y-m-d');
        if ($this->departure?->time) {
            $when .= ' — التحرك '.substr((string) $this->departure->time, 0, 5);
        }

        $message = implode("\n", [
            "أهلاً {$this->customer_name}، معاك فريق مصر رايح جاي 𓂀",
            "بنأكد حجزك رقم {$this->reference}:",
            "الرحلة: {$this->tour->title_ar}",
            "التاريخ: {$when}",
            "عدد الأفراد: {$people}",
            'الإجمالي: '.number_format((float) $this->total_price).' ج.م',
            'لو محتاج أي تعديل أو عندك استفسار، رد علينا هنا.',
        ]);

        return 'https://wa.me/'.$digits.'?text='.rawurlencode($message);
    }

    /** A wa.me link with a friendly "your trip is tomorrow" reminder. */
    public function whatsappReminderUrl(): ?string
    {
        $digits = $this->whatsappPhone();

        if ($digits === null) {
            return null;
        }

        $when = $this->travel_date->format('Y-m-d');
        if ($this->departure?->time) {
            $when .= ' — التحرك الساعة '.substr((string) $this->departure->time, 0, 5);
        }

        $message = implode("\n", [
            "أهلاً {$this->customer_name}، معاك فريق مصر رايح جاي 𓂀",
            "بنفكرك إن رحلتك بكرة:",
            "الرحلة: {$this->tour->title_ar}",
            "التاريخ: {$when}",
            "رقم الحجز: {$this->reference}",
            'جاهز؟ لو حصل أي تغيير أو محتاج مساعدة، رد علينا هنا.',
        ]);

        return 'https://wa.me/'.$digits.'?text='.rawurlencode($message);
    }

    /** A wa.me link with a post-trip thank-you message. */
    public function whatsappThanksUrl(): ?string
    {
        $digits = $this->whatsappPhone();

        if ($digits === null) {
            return null;
        }

        $message = implode("\n", [
            "أهلاً {$this->customer_name}، معاك فريق مصر رايح جاي 𓂀",
            "نتمنى تكون رحلة «{$this->tour->title_ar}» عجبتك وصنعت ذكريات حلوة.",
            'شكرًا لثقتك فينا، ونستنى نشوفك في رحلة جديدة قريب.',
        ]);

        return 'https://wa.me/'.$digits.'?text='.rawurlencode($message);
    }

    /** A wa.me link asking the guest to review, with their booking page link. */
    public function whatsappReviewUrl(): ?string
    {
        $digits = $this->whatsappPhone();

        if ($digits === null) {
            return null;
        }

        $message = implode("\n", [
            "أهلاً {$this->customer_name}، معاك فريق مصر رايح جاي 𓂀",
            "رأيك في رحلة «{$this->tour->title_ar}» يهمنا جدًا وبيساعد مسافرين غيرك يختاروا صح.",
            'قيّم رحلتك من صفحة حجزك هنا:',
            url('/booking/'.$this->reference),
            'شكرًا ليك!',
        ]);

        return 'https://wa.me/'.$digits.'?text='.rawurlencode($message);
    }

    /** All one-tap WhatsApp templates for the admin, keyed by name. */
    public function whatsappTemplates(): array
    {
        return array_filter([
            'confirm' => $this->whatsappUrl(),
            'remind' => $this->whatsappReminderUrl(),
            'thanks' => $this->whatsappThanksUrl(),
            'review' => $this->whatsappReviewUrl(),
        ]);
    }

    public function canBeReviewed(): bool
    {
        return $this->status === self::STATUS_CONFIRMED
            && $this->travel_date !== null
            && $this->travel_date->lt(now()->startOfDay());
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
    public static function calculateTotal(Tour $tour, int $adults, int $children, ?float $unitPrice = null): float
    {
        $price = $unitPrice ?? (float) $tour->price;

        return round(($price * $adults) + (($price * 0.5) * $children), 2);
    }
}
