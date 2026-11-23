<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    /** Moderation queue: unpublished reviews first, newest first. */
    public function index(): Response
    {
        $reviews = Review::with(['tour:id,slug,title_ar,title_en', 'booking:id,reference'])
            ->orderBy('is_approved')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Review $review) => [
                'id' => $review->id,
                'author_name' => $review->author_name,
                'rating' => $review->rating,
                'body' => $review->body,
                'is_approved' => (bool) $review->is_approved,
                'created_at' => $review->created_at->format('Y-m-d'),
                'tour' => $review->tour ? [
                    'slug' => $review->tour->slug,
                    'title_ar' => $review->tour->title_ar,
                    'title_en' => $review->tour->title_en,
                ] : null,
                'booking_reference' => $review->booking?->reference,
            ]);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    /** Publish a review on the tour page, or hide it again. */
    public function toggle(Review $review): RedirectResponse
    {
        $review->update(['is_approved' => ! $review->is_approved]);

        return back()->with('success', 'review_updated');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        return back()->with('success', 'review_deleted');
    }
}
