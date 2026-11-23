import { Head, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useLocale } from '../../../i18n/LocaleContext';
import { localized } from '../../../lib/format';

/**
 * Review moderation queue: unpublished reviews first. Publishing
 * puts a review on the tour page and folds it into the tour's
 * public rating; hiding reverses both.
 */
export default function ReviewsIndex({ reviews = [] }) {
    const { t, locale } = useLocale();

    return (
        <AdminLayout title={t('admin.reviews.title')}>
            <Head title={t('admin.reviews.title')} />
            <h1 className="font-display text-2xl font-bold text-ink">{t('admin.reviews.title')}</h1>

            {reviews.length === 0 ? (
                <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-ink/55 shadow-sm ring-1 ring-sand">{t('admin.reviews.empty')}</p>
            ) : (
                <ul className="mt-6 space-y-4">
                    {reviews.map((review) => (
                        <li key={review.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sand">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                                <span className="font-display font-bold text-ink">{review.author_name}</span>
                                <span aria-label={`${review.rating}/5`} className="tracking-widest">
                                    <span className="text-gold-500">{'★'.repeat(review.rating)}</span>
                                    <span className="text-ink/15">{'★'.repeat(5 - review.rating)}</span>
                                </span>
                                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${review.is_approved ? 'bg-turquoise-600/10 text-turquoise-600' : 'bg-gold-500/15 text-gold-deep'}`}>
                                    {review.is_approved ? t('admin.reviews.published') : t('admin.reviews.awaiting')}
                                </span>
                                <span className="text-ink/45">{review.created_at}</span>
                                <span className="ms-auto flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => router.patch(`/admin/reviews/${review.id}/toggle`, {}, { preserveScroll: true })}
                                        className="rounded-md bg-gold px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-gold-light"
                                    >
                                        {review.is_approved ? t('admin.reviews.hide') : t('admin.reviews.approve')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.delete(`/admin/reviews/${review.id}`, { preserveScroll: true })}
                                        className="rounded-md border border-sand px-3 py-1.5 text-xs font-bold text-carnelian-600 transition hover:border-carnelian-600"
                                    >
                                        {t('admin.reviews.delete')}
                                    </button>
                                </span>
                            </div>
                            <p className="mt-3 leading-relaxed text-ink/80">{review.body}</p>
                            <p className="mt-3 text-xs text-ink/45">
                                {review.tour ? localized(review.tour, 'title', locale) : ''}
                                {review.booking_reference ? ` · ${t('admin.reviews.booking')}: ${review.booking_reference}` : ''}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </AdminLayout>
    );
}
