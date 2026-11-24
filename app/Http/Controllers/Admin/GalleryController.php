<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryPhoto;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    /** Moderation queue: pending photos first, then published ones. */
    public function index(): Response
    {
        $photos = GalleryPhoto::with('booking:id,reference,customer_name,tour_id', 'booking.tour:id,title_ar')
            ->orderBy('is_approved')
            ->latest()
            ->limit(80)
            ->get()
            ->map(fn (GalleryPhoto $photo) => [
                'id' => $photo->id,
                'url' => $photo->url(),
                'caption' => $photo->caption,
                'is_approved' => $photo->is_approved,
                'traveller' => $photo->booking->customer_name,
                'reference' => $photo->booking->reference,
                'tour_title' => $photo->booking->tour->title_ar,
            ]);

        return Inertia::render('Admin/Gallery/Index', ['photos' => $photos]);
    }

    public function toggle(GalleryPhoto $photo): RedirectResponse
    {
        $photo->update(['is_approved' => ! $photo->is_approved]);

        return back();
    }

    public function destroy(GalleryPhoto $photo): RedirectResponse
    {
        Storage::disk('public')->delete($photo->image);
        $photo->delete();

        return back();
    }
}
