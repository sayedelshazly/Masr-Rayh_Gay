import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import Reveal from '../../Components/Reveal';
import { DurationLabel } from '../../Components/TourCard';
import { useLocale } from '../../i18n/LocaleContext';
import { formatPrice, formatTimeLabel, localized } from '../../lib/format';

const STATUS_STYLES = {
    pending: 'bg-gold-500/15 text-gold-300 ring-gold-500/40',
    confirmed: 'bg-teal-400/10 text-teal-300 ring-teal-400/40',
    cancelled: 'bg-red-400/10 text-red-300 ring-red-400/40',
    expired: 'bg-white/5 text-sand-100/50 ring-white/15',
};

function formatDate(value, locale) {
    if (!value) {
        return '';
    }

    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          });
}

function DetailRow({ label, children }) {
    return (
        <div className="flex flex-wrap items-baseline justify-between gap-2 py-3">
            <span className="text-sm font-medium text-sand-100/60">{label}</span>
            <span className="font-display text-base font-bold text-sand-100">{children}</span>
        </div>
    );
}

export default function BookingShow({ booking, canReview = false }) {
    const { t, locale } = useLocale();
    const tour = booking.tour ?? {};
    const destination = tour.destination ?? {};
    const statusStyle = STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending;

    const guests = [
        `${booking.adults} ${t('booking.adults')}`,
        booking.children > 0 ? `${booking.children} ${t('booking.children')}` : null,
    ]
        .filter(Boolean)
        .join(' · ');

    const review = booking.review ?? null;
    const [hoverRating, setHoverRating] = useState(0);
    const reviewForm = useForm({ rating: 5, body: '' });
    const submitReview = (event) => {
        event.preventDefault();
        reviewForm.post(`/booking/${booking.reference}/review`, { preserveScroll: true });
    };
    const shownRating = hoverRating || reviewForm.data.rating;

    return (
        <AppLayout backdrop={tour.image ?? undefined}>
            <Head title={t('booking.confirmationMetaTitle')} />

            <section>
                <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
                    <Reveal>
                        <span
                            aria-hidden="true"
                            className="font-display mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold-500 text-4xl font-extrabold text-ink-900 shadow-lg shadow-gold-500/30"
                        >
                            ✓
                        </span>
                        <h1 className="font-display mt-6 text-3xl font-extrabold leading-snug text-sand-100 sm:text-4xl">
                            {t('booking.successTitle')}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl leading-loose text-sand-100/75">{t('booking.successText')}</p>
                    </Reveal>
                </div>
            </section>

            <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
                <Reveal>
                {/* Reference card */}
                <div className="rounded-lg border-2 border-dashed border-gold-500/50 bg-nile-950/70 px-6 py-7 text-center shadow-lg shadow-black/25 backdrop-blur">
                    <p className="text-sm font-semibold text-sand-100/55">{t('booking.reference')}</p>
                    <p className="font-display mt-2 text-4xl font-extrabold tracking-[0.2em] text-gold-300 sm:text-5xl">
                        {booking.reference}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-sand-100/55">{t('booking.referenceHint')}</p>
                    <span className={`mt-4 inline-block rounded-full px-4 py-1.5 text-sm font-bold ring-1 ${statusStyle}`}>
                        {t('booking.status')}: {t(`booking.statuses.${booking.status}`)}
                    </span>
                </div>

                {/* Booking details */}
                <div className="mt-6 rounded-lg bg-nile-950/70 px-6 py-3 shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:px-8">
                    <DetailRow label={t('booking.tourLabel')}>
                        <Link href={`/tours/${tour.slug}`} className="text-gold-300 transition-colors hover:text-gold-500">
                            {localized(tour, 'title', locale)}
                        </Link>
                    </DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={localized(destination, 'name', locale) || t('booking.tourLabel')}>
                        <span aria-hidden="true" className="me-2">{destination.glyph ?? '𓂀'}</span>
                        <DurationLabel tour={tour} />
                    </DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={t('booking.dateLabel')}>
                        {formatDate(booking.travel_date, locale)}
                        {booking.departure?.time ? ` · ${formatTimeLabel(String(booking.departure.time).slice(0, 5), locale)}` : ''}
                    </DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={t('booking.guestsLine')}>{guests}</DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={t('booking.customerLabel')}>{booking.customer_name}</DetailRow>
                    <div className="border-t border-white/10" />
                    <DetailRow label={t('booking.totalLabel')}>
                        <span className="font-display text-2xl font-extrabold text-gold-300">
                            {formatPrice(booking.total_price, locale)}{' '}
                            <span className="text-sm font-semibold text-sand-100/60">{t('common.currency')}</span>
                        </span>
                    </DetailRow>
                </div>
                </Reveal>

                {(review || canReview) && (
                    <div className="mx-auto mt-8 max-w-3xl rounded-lg bg-nile-950/70 p-6 text-start shadow-lg shadow-black/25 ring-1 ring-white/10 backdrop-blur sm:p-8">
                        <h2 className="font-display text-xl font-bold text-sand-100">{t('reviews.formTitle')}</h2>
                        {review ? (
                            <div className="mt-4">
                                <p aria-label={`${review.rating}/5`} className="text-lg tracking-widest">
                                    <span className="text-gold-400">{'★'.repeat(review.rating)}</span>
                                    <span className="text-white/20">{'★'.repeat(5 - review.rating)}</span>
                                </p>
                                <p className="mt-3 leading-relaxed text-sand-100/80">{review.body}</p>
                                <p className="mt-4 rounded-md bg-white/5 px-4 py-3 text-sm text-gold-300 ring-1 ring-gold-500/25">
                                    {review.is_approved ? t('reviews.publishedNote') : t('reviews.pendingNote')}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={submitReview} className="mt-4">
                                <p className="text-sm leading-relaxed text-sand-100/65">{t('reviews.formText')}</p>
                                <p className="mt-4 text-sm font-bold text-sand-100/80">{t('reviews.ratingLabel')}</p>
                                <div className="mt-1 flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            aria-label={`${value}/5`}
                                            onMouseEnter={() => setHoverRating(value)}
                                            onClick={() => reviewForm.setData('rating', value)}
                                            className={`text-3xl leading-none transition ${value <= shownRating ? 'text-gold-400' : 'text-white/20'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                {reviewForm.errors.rating && <p className="mt-1.5 text-xs font-medium text-red-300">{reviewForm.errors.rating}</p>}
                                <label htmlFor="review_body" className="mt-4 block text-sm font-bold text-sand-100/80">{t('reviews.bodyLabel')}</label>
                                <textarea
                                    id="review_body"
                                    rows="3"
                                    className="mt-1.5 w-full rounded-md border border-sand-100/20 bg-white/5 px-4 py-3 text-sm font-medium text-sand-100 outline-none transition-colors placeholder:text-sand-100/35 focus:border-gold-500"
                                    placeholder={t('reviews.bodyPlaceholder')}
                                    value={reviewForm.data.body}
                                    onChange={(event) => reviewForm.setData('body', event.target.value)}
                                />
                                {reviewForm.errors.body && <p className="mt-1.5 text-xs font-medium text-red-300">{reviewForm.errors.body}</p>}
                                <button
                                    type="submit"
                                    disabled={reviewForm.processing}
                                    className="font-subhead mt-4 min-h-[44px] rounded-md bg-gold-500 px-6 py-2.5 font-bold text-ink-900 transition-colors hover:bg-gold-300 disabled:opacity-60"
                                >
                                    {t('reviews.submit')}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/tours"
                        className="font-display rounded-md bg-gold-500 px-6 py-3 font-bold text-ink-900 transition-colors hover:bg-gold-300"
                    >
                        {t('booking.browseTours')}
                    </Link>
                    <Link
                        href={`/tours/${tour.slug}`}
                        className="font-display rounded-md border border-gold-500 bg-transparent px-6 py-3 font-bold text-gold-300 ring-1 ring-white/10 backdrop-blur transition-colors hover:bg-gold-500/10"
                    >
                        {t('booking.backToTour')}
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}
