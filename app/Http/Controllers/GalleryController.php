<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\GalleryPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    /** The public travellers' gallery: approved photos only. */
    public function index(): Response
    {
        $photos = GalleryPhoto::approved()
            ->with('booking.tour:id,title_ar,title_en,slug')
            ->latest()
            ->limit(60)
            ->get()
            ->map(fn (GalleryPhoto $photo) => [
                'id' => $photo->id,
                'url' => $photo->url(),
                'caption' => $photo->caption,
                'traveller' => $photo->booking->customer_name,
                'tour' => [
                    'title_ar' => $photo->booking->tour->title_ar,
                    'title_en' => $photo->booking->tour->title_en,
                    'slug' => $photo->booking->tour->slug,
                ],
            ]);

        return Inertia::render('Gallery/Index', ['photos' => $photos]);
    }

    /**
     * A traveller shares a photo from their booking page. The booking
     * reference is the capability (same as reviews); the photo goes
     * live only after admin moderation.
     */
    public function store(Request $request, Booking $booking): RedirectResponse
    {
        abort_if(! \App\Models\SiteSetting::singleton()->photos_enabled, 403);
        abort_unless($booking->canSharePhotos(), 422);

        if ($booking->galleryPhotos()->count() >= GalleryPhoto::MAX_PER_BOOKING) {
            throw ValidationException::withMessages([
                'photo' => $request->input('locale') === 'en'
                    ? 'You have shared the maximum number of photos for this trip.'
                    : 'وصلت للحد الأقصى من الصور للرحلة دي.',
            ]);
        }

        $validated = $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'caption' => ['nullable', 'string', 'max:140'],
        ]);

        $path = $request->file('photo')->store('gallery', 'public');

        $booking->galleryPhotos()->create([
            'image' => $path,
            'caption' => $validated['caption'] ?? null,
            'is_approved' => false,
        ]);

        return back();
    }
}
